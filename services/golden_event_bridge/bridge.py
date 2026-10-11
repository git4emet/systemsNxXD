"""Single-process coordinate bridge with SQLite commit before state advance.

The score-free Dr.Shift LUT is the transition core. This boundary validates
requests and coordinates persistence/replay. Receipts are unsigned evidence
of recorded bytes; the database is not an immutable or authenticated ledger.
"""
from copy import deepcopy
import json
import sqlite3
from hashlib import sha256
from threading import Condition, RLock

from packages.coordinate_core import DrShiftStateEngine, canonical_bytes, verify_receipt


class EventBridge:
    def __init__(self, path, initial_point, space):
        self._lock = RLock()
        self.changed = Condition(self._lock)
        self.closed = False
        self._space = deepcopy(space)
        keys = set()
        for point, relations in space.items():
            for relation in relations:
                key = (point, relation["avenue"])
                if relation["from"] != point or relation["to"] not in space or key in keys:
                    raise ValueError("ambiguous or invalid relation registration")
                keys.add(key)
        self._db = sqlite3.connect(path, check_same_thread=False)
        self._db.execute("PRAGMA journal_mode=WAL")
        self._db.execute("PRAGMA synchronous=FULL")
        self._db.execute("CREATE TABLE IF NOT EXISTS scope (id INTEGER PRIMARY KEY, digest TEXT NOT NULL)")
        self._db.execute("CREATE TABLE IF NOT EXISTS events (seq INTEGER PRIMARY KEY, event_id TEXT UNIQUE NOT NULL, request TEXT NOT NULL, receipt TEXT NOT NULL)")
        scope = sha256(canonical_bytes({"initial_point": initial_point, "space": space})).hexdigest()
        old_scope = self._db.execute("SELECT digest FROM scope WHERE id=1").fetchone()
        if old_scope and old_scope[0] != scope:
            raise ValueError("database belongs to a different coordinate space")
        self._db.execute("INSERT OR IGNORE INTO scope VALUES (1, ?)", (scope,))
        self._db.commit()
        point, previous = initial_point, "0" * 64
        for event_id, request_text, receipt_text in self._db.execute("SELECT event_id, request, receipt FROM events ORDER BY seq"):
            request, receipt = json.loads(request_text), json.loads(receipt_text)
            t = receipt["CRED"]["TOFARKLE"]["traversal"]
            relation = next(r for r in space[point] if r["avenue"] == request["avenue_id"])
            expected = {"event_id": event_id, "from": point, "via": relation["avenue"], "to": relation["to"], "script": relation["script"], "timestamp": request["timestamp"]}
            if (not verify_receipt(receipt) or receipt["CRED"]["TOFAR"]["previous_sha256"] != previous
                    or t != expected or request["from_point"] != point
                    or request["event_id"] != event_id
                    or receipt["CRED"]["TOPHDARC"]["source_receipts"] != request["source_receipts"]):
                raise ValueError("receipt replay does not match the registered path")
            point, previous = t["to"], receipt["receipt_sha256"]
        self._engine = DrShiftStateEngine(point, space, self._append, previous)
        self._pending_request = None

    def _append(self, receipt):
        request = self._pending_request
        with self._db:
            self._db.execute("INSERT INTO events (event_id, request, receipt) VALUES (?, ?, ?)",
                             (request["event_id"], canonical_bytes(request).decode(), canonical_bytes(receipt).decode()))

    def current(self):
        with self._lock:
            return self._engine.available_avenues()

    def select(self, request):
        required = {"event_id", "from_point", "avenue_id", "timestamp", "source_receipts"}
        if set(request) != required or any(not isinstance(request[k], str) or not request[k] for k in required - {"source_receipts"}):
            raise ValueError("selection needs event_id, from_point, avenue_id, timestamp and source_receipts")
        if not isinstance(request["source_receipts"], list) or any(not isinstance(r, str) for r in request["source_receipts"]):
            raise ValueError("source_receipts must be a list of references")
        request = deepcopy(request)
        with self.changed:
            existing = self._db.execute("SELECT request, receipt FROM events WHERE event_id=?", (request["event_id"],)).fetchone()
            if existing:
                if existing[0] != canonical_bytes(request).decode():
                    raise ValueError("event_id already records a different selection")
                return json.loads(existing[1])
            if request["from_point"] != self._engine.point:
                raise ValueError("selection comes from a stale point")
            self._pending_request = request
            try:
                receipt = self._engine.shift_where(request["avenue_id"], event_id=request["event_id"],
                                                  timestamp=request["timestamp"], source_receipts=request["source_receipts"])
            finally:
                self._pending_request = None
            self.changed.notify_all()
            return receipt

    def events_after(self, seq=0):
        with self._lock:
            return [(n, golden_event(json.loads(r))) for n, r in self._db.execute("SELECT seq, receipt FROM events WHERE seq>? ORDER BY seq", (seq,))]

    def close(self):
        with self.changed:
            self.closed = True
            self._db.close()
            self.changed.notify_all()


def golden_event(receipt):
    traversal = receipt["CRED"]["TOFARKLE"]["traversal"]
    return {
        "schema": "mobiius.golden-event.v1", "event_id": traversal["event_id"],
        "ts": traversal["timestamp"], "kind": "coordinate.traversal", "actor": "local-selection",
        "thread_id": "coordinate:local", "turn_index": 0, "content": "Selected avenue recorded",
        "extract": {"point": traversal["to"], "avenue": traversal["via"]},
        "links": receipt["CRED"]["TOPHDARC"]["source_receipts"],
        "tofar": receipt, "dirty_sectors": ["system", "hud"],
        "metadata": {"canonical_receipt_body": canonical_bytes({"CRED": receipt["CRED"]}).decode()},
    }
