import ast
from copy import deepcopy
from pathlib import Path
import tempfile
import unittest

from packages.coordinate_core.dr_shift import DrShiftStateEngine, JsonlWriter, project_face, verify_receipt


SPACE = {
    "p:00": [
        {"avenue": "a:01", "from": "p:00", "to": "p:01",
         "transform": "phase.rotate", "script": "record phase view"},
        {"avenue": "a:02", "from": "p:00", "to": "p:02",
         "transform": "medium.interact", "script": "record medium view"},
    ],
    "p:01": [{"avenue": "a:return", "from": "p:01", "to": "p:00",
              "transform": "return", "script": "record return"}],
    "p:02": [],
}
STAMP = "2026-10-10T20:11:00-05:00"


class CoordinateTests(unittest.TestCase):
    def setUp(self):
        self.receipts = []
        self.engine = DrShiftStateEngine("p:00", SPACE, self.receipts.append)

    def shift(self, event_id="e:01"):
        return self.engine.shift_where("a:01", event_id=event_id,
                                       timestamp=STAMP, source_receipts=("source:01",))

    def test_enumeration_preserves_point_and_unselected_avenues(self):
        snapshot = self.engine.available_avenues()
        self.assertEqual(snapshot, {"point": "p:00", "available_avenues": SPACE["p:00"]})
        snapshot["available_avenues"].clear()
        self.assertEqual(self.engine.available_avenues()["available_avenues"], SPACE["p:00"])
        self.assertEqual(self.receipts, [])

    def test_only_supplied_selection_is_traversed(self):
        receipt = self.shift()
        self.assertEqual(self.engine.point, "p:01")
        self.assertEqual(receipt["CRED"]["TOFARKLE"]["traversal"]["via"], "a:01")
        self.assertEqual(len(self.receipts), 1)

    def test_missing_relation_does_not_become_silent_self_transition(self):
        with self.assertRaises(KeyError):
            self.engine.shift_where("a:missing", event_id="e:missing", timestamp=STAMP)
        self.assertEqual(self.engine.point, "p:00")
        self.assertEqual(self.receipts, [])

    def test_digest_remains_verifiable_after_sealing_and_detects_tamper(self):
        receipt = self.shift()
        self.assertTrue(verify_receipt(receipt))
        changed = deepcopy(receipt)
        changed["CRED"]["TOFARKLE"]["traversal"]["to"] = "p:02"
        self.assertFalse(verify_receipt(changed))

    def test_receipts_link_previous_digest_and_preserve_source_reference(self):
        first = self.shift()
        second = self.engine.shift_where("a:return", event_id="e:02", timestamp=STAMP)
        self.assertEqual(second["CRED"]["TOFAR"]["previous_sha256"], first["receipt_sha256"])
        self.assertEqual(first["CRED"]["TOPHDARC"]["source_receipts"], ["source:01"])
        self.assertTrue(verify_receipt(second))

    def test_failed_append_leaves_current_point_unchanged(self):
        def failed_sink(receipt):
            raise OSError("test append failure before writing")
        engine = DrShiftStateEngine("p:00", SPACE, failed_sink)
        with self.assertRaises(OSError):
            engine.shift_where("a:01", event_id="e:01", timestamp=STAMP)
        self.assertEqual(engine.point, "p:00")

    def test_many_to_one_projection_retains_distinct_canonical_addresses(self):
        a = {"omega_id": 0, "alpha_id": 0, "phase": "phase:a", "DI": "source-defined"}
        b = {"omega_id": 41, "alpha_id": 40, "phase": "phase:b", "DI": "source-defined"}
        one, two = project_face(a, 2, 7), project_face(b, 2, 7)
        self.assertEqual(one["projection"], two["projection"])
        self.assertEqual(one["canonical_address"], a)
        self.assertEqual(two["canonical_address"], b)

    def test_full_projection_covers_exactly_192_faces_without_replacing_1764_addresses(self):
        projections = [project_face({"omega_id": omega, "alpha_id": alpha}, band, domain)
                       for omega in range(42) for alpha in range(42)
                       for band in range(3) for domain in range(8)]
        faces = {r["projection"]["face"] for r in projections}
        addresses = {(r["canonical_address"]["omega_id"], r["canonical_address"]["alpha_id"])
                     for r in projections}
        self.assertEqual(faces, set(range(192)))
        self.assertEqual(len(addresses), 1764)

    def test_core_contains_no_source_level_conditionals(self):
        tree = ast.parse((Path(__file__).parents[1] / "packages/coordinate_core/dr_shift.py").read_text())
        self.assertFalse(any(isinstance(n, (ast.If, ast.IfExp, ast.Match)) for n in ast.walk(tree)))

    def test_jsonl_writer_records_verifiable_receipt(self):
        import json
        with tempfile.TemporaryDirectory() as directory:
            file = Path(directory) / "tofar.jsonl"
            engine = DrShiftStateEngine("p:00", SPACE, JsonlWriter(file))
            receipt = engine.shift_where("a:01", event_id="e:01", timestamp=STAMP)
            stored = json.loads(file.read_text())
            self.assertEqual(stored, receipt)
            self.assertTrue(verify_receipt(stored))


if __name__ == "__main__":
    unittest.main()
