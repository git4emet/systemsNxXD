from copy import deepcopy
import unittest
from hgraph.test import eval_node
from packages.coordinate_core import seal_receipt
from adapters.hgraph.receipt_lens import ingest_receipt, receipt_lens


class HGraphLensTests(unittest.TestCase):
    def test_multitick_no_tick_and_replay_preserve_source_identity(self):
        receipt = seal_receipt({"event_id": "one", "from": "Sense", "via": "Parse", "to": "Parse", "timestamp": "2026-10-11T00:00:00Z", "script": "record"}, ["source:one"], "0" * 64)
        first = ingest_receipt(receipt)
        other = deepcopy(receipt)
        other["CRED"]["TOFARKLE"]["traversal"]["event_id"] = "two"
        second = ingest_receipt(seal_receipt(other["CRED"]["TOFARKLE"]["traversal"], ["source:two"], receipt["receipt_sha256"]))
        expected = [first, None, second]
        self.assertEqual(eval_node(receipt_lens, expected), expected)
        self.assertEqual(eval_node(receipt_lens, expected), expected)

    def test_tampered_receipt_never_enters_the_graph(self):
        with self.assertRaises(ValueError):
            ingest_receipt({"receipt_sha256": "bad", "CRED": {}})


if __name__ == "__main__":
    unittest.main()
