from copy import deepcopy
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest
from threading import Thread
from urllib.request import urlopen, Request

from services.golden_event_bridge.bridge import EventBridge
from services.golden_event_bridge.http_server import make_server

SPACE = {"Sense": [{"from": "Sense", "avenue": "Parse", "to": "Parse", "script": "record parsing"}],
         "Parse": [{"from": "Parse", "avenue": "Return", "to": "Sense", "script": "record return"}]}
REQUEST = {"event_id": "event:1", "from_point": "Sense", "avenue_id": "Parse", "timestamp": "2026-10-11T01:40:00Z", "source_receipts": ["source:example"]}


class BridgeTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.path = Path(self.tmp.name) / "events.sqlite"
        self.bridge = EventBridge(self.path, "Sense", SPACE)

    def tearDown(self):
        self.bridge.close()
        self.tmp.cleanup()

    def test_retry_is_idempotent_after_point_has_advanced(self):
        first = self.bridge.select(REQUEST)
        self.assertEqual(self.bridge.select(REQUEST), first)
        self.assertEqual(len(self.bridge.events_after()), 1)
        self.assertEqual(self.bridge.current()["point"], "Parse")

    def test_reused_id_with_changed_selection_is_rejected(self):
        self.bridge.select(REQUEST)
        with self.assertRaises(ValueError):
            self.bridge.select({**REQUEST, "timestamp": "different"})

    def test_stale_point_and_unknown_avenue_write_nothing(self):
        for changed in ({"from_point": "Parse"}, {"avenue_id": "missing"}):
            with self.assertRaises((ValueError, KeyError)):
                self.bridge.select({**REQUEST, **changed})
        self.assertEqual(self.bridge.events_after(), [])

    def test_restart_preserves_point_receipts_and_idempotence(self):
        receipt = self.bridge.select(REQUEST)
        self.bridge.close()
        self.bridge = EventBridge(self.path, "Sense", SPACE)
        self.assertEqual(self.bridge.current()["point"], "Parse")
        self.assertEqual(self.bridge.select(REQUEST), receipt)

    def test_corrupt_replay_is_rejected(self):
        self.bridge.select(REQUEST)
        with sqlite3.connect(self.path) as db:
            r = json.loads(db.execute("SELECT receipt FROM events").fetchone()[0])
            r["CRED"]["TOFARKLE"]["traversal"]["to"] = "Sense"
            db.execute("UPDATE events SET receipt=?", (json.dumps(r),))
        with self.assertRaises(ValueError):
            EventBridge(self.path, "Sense", SPACE)

    def test_space_change_and_duplicate_keys_are_rejected(self):
        altered = deepcopy(SPACE)
        altered["Sense"][0]["script"] = "changed"
        with self.assertRaises(ValueError):
            EventBridge(self.path, "Sense", altered)
        altered["Sense"].append(altered["Sense"][0])
        with self.assertRaises(ValueError):
            EventBridge(":memory:", "Sense", altered)

    def test_commit_failure_leaves_point_unchanged(self):
        self.bridge._db.execute("CREATE TRIGGER reject_append BEFORE INSERT ON events BEGIN SELECT RAISE(ABORT,'test failure'); END")
        with self.assertRaises(sqlite3.IntegrityError):
            self.bridge.select(REQUEST)
        self.assertEqual(self.bridge.current()["point"], "Sense")
        self.assertEqual(self.bridge.events_after(), [])

    def test_http_selection_roundtrip_matches_durable_stream(self):
        server = make_server(self.bridge, ("127.0.0.1", 0))
        thread = Thread(target=server.serve_forever, daemon=True)
        thread.start()
        base = f"http://127.0.0.1:{server.server_port}"
        try:
            with urlopen(base + "/current") as response:
                self.assertEqual(json.load(response)["point"], "Sense")
            request = Request(base + "/select", data=json.dumps(REQUEST).encode(), headers={"Content-Type": "application/json"})
            with urlopen(request) as response:
                event = json.load(response)
            self.assertEqual(self.bridge.events_after()[0][1], event)
            with urlopen(base + "/sse?after=0", timeout=2) as stream:
                self.assertEqual(stream.readline().decode().strip(), "id: 1")
                self.assertEqual(stream.readline().decode().strip(), "event: golden")
                self.assertEqual(json.loads(stream.readline().decode().removeprefix("data: ")), event)
        finally:
            server.shutdown()
            server.server_close()


if __name__ == "__main__":
    unittest.main()
