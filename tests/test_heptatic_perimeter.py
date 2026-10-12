import json
from pathlib import Path
import unittest
from services.heptatic_perimeter import HeptaticPerimeter, PerimeterError, digest

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = json.loads((ROOT / "examples/heptatic-perimeter.json").read_text(encoding="utf-8"))
Q = {q: "source-backed: " + q for q in MANIFEST["intent_perimeter"]}
BASE = {"source_ref": "archive:2026-03-24", "payload": {"demo": 1},
        "perimeter": Q, "legacy_triad": {"input_a": "A", "input_b": "B", "emergent": "result"}}


class HeptaticTests(unittest.TestCase):
    def setUp(self):
        self.h = HeptaticPerimeter(MANIFEST)

    def test_seven_intent_questions_differ_from_seven_stages(self):
        self.assertEqual(len(MANIFEST["intent_perimeter"]), 7)
        self.assertEqual(len(MANIFEST["capture_stages"]), 7)
        self.assertNotEqual(MANIFEST["intent_perimeter"], MANIFEST["capture_stages"])

    def test_capture_has_correct_effect_barrier_and_preserves_triad(self):
        self.assertEqual(self.h.inspect(dict(BASE, mode="capture"))["reason"], "actor_target_required")
        p = self.h.inspect(dict(BASE, mode="capture", actor_ref="operator:1", target_ref="job:1"))
        self.assertEqual(p["state"], "requires_host_authorization")
        self.assertEqual(p["control_boundary"], "host_authorization_before_any_capture_effect")
        self.assertFalse(p["executed"] or p["policy_authorized"])
        self.assertEqual(p["candidate"]["legacy_triad"], BASE["legacy_triad"])

    def test_replay_requires_recorded_event_and_never_executes(self):
        self.assertEqual(self.h.inspect(dict(BASE, mode="replay"))["reason"], "recorded_event_required")
        p = self.h.inspect(dict(BASE, mode="replay", recorded_event_ref="event:1"))
        self.assertEqual(p["state"], "read_only_replay_plan")
        self.assertEqual(p["control_boundary"], "read_only")
        self.assertFalse(p["external_effects"])

    def test_anti_event_is_only_counterfactual_not_rollback(self):
        self.assertEqual(self.h.inspect(dict(BASE, mode="anti_event",
                                             original_event_ref="event:1"))["reason"],
                         "original_and_reason_required")
        p = self.h.inspect(dict(BASE, mode="anti_event", original_event_ref="event:1",
                                counterfactual_reason="What if B instead of A?"))
        self.assertEqual(p["state"], "counterfactual_proposal_only")
        self.assertFalse(p["executed"] or p["external_effects"])
        self.assertEqual(p["candidate"]["original_event_ref"], "event:1")

    def test_missing_question_defers(self):
        envelope = dict(BASE, mode="capture", actor_ref="a", target_ref="b",
                        perimeter=dict(Q, where="?"))
        p = self.h.inspect(envelope)
        self.assertEqual(p["reason"], "perimeter_incomplete")
        self.assertEqual(p["questions"], ["where"])

    def test_no_eighth_question_or_implicit_triad_remap(self):
        with self.assertRaises(PerimeterError):
            self.h.inspect(dict(BASE, mode="replay", recorded_event_ref="x", perimeter=dict(Q, eighth="x")))
        with self.assertRaises(PerimeterError):
            self.h.inspect(dict(BASE, mode="replay", recorded_event_ref="x", legacy_triad={"input_a": "A"}))

    def test_candidate_digest_does_not_authenticate(self):
        p = self.h.inspect(dict(BASE, mode="replay", recorded_event_ref="x"))
        self.assertEqual(p["candidate_sha256"], digest(p["candidate"]))
        self.assertFalse(p["source_verified"])
        self.assertFalse(p["policy_authorized"])


if __name__ == "__main__":
    unittest.main()
