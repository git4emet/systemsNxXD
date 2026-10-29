"""Pure side-effect-free seven-question perimeter and three event modes.

A heptatic envelope wraps, rather than replaces, the historical A/B/emergent
triad. No event is executed, replayed externally, undone, or authorized here.
"""
from __future__ import annotations
import hashlib
import json
from typing import Any

QUESTIONS = ("how", "why", "what", "where", "when", "so", "for")
MODES = ("capture", "replay", "anti_event")
CAPTURE_STAGES = ("ethical_core", "whiteboard", "tofar_engine", "buddy_mesh",
                  "twine", "automation", "dashboard")


class PerimeterError(ValueError):
    """Malformed envelope or source provenance."""


def digest(value: Any) -> str:
    """Content-addressing of a candidate, never proof of authorization."""
    raw = json.dumps(value, sort_keys=True, ensure_ascii=False, allow_nan=False,
                     separators=(",", ":"))
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def _filled(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip()) and value.strip() != "?"


class HeptaticPerimeter:
    def __init__(self, manifest: dict):
        if manifest.get("schema") != "mobiius.heptatic.v1":
            raise PerimeterError("Unsupported heptatic manifest")
        if tuple(manifest.get("intent_perimeter", [])) != QUESTIONS:
            raise PerimeterError("Seven historical intent questions changed")
        if tuple(manifest.get("capture_stages", [])) != CAPTURE_STAGES:
            raise PerimeterError("Seven historical stage descriptors changed")
        self.manifest = manifest

    def inspect(self, envelope: dict) -> dict:
        if not isinstance(envelope, dict):
            raise PerimeterError("Envelope must be an object")
        mode = envelope.get("mode")
        if mode not in MODES:
            raise PerimeterError("Expected capture, replay, or anti_event")
        perimeter = envelope.get("perimeter")
        if not isinstance(perimeter, dict) or set(perimeter) != set(QUESTIONS):
            raise PerimeterError("Perimeter needs exactly seven named questions")
        missing = [q for q in QUESTIONS if not _filled(perimeter[q])]
        if missing:
            return {"state": "deferred", "mode": mode,
                    "reason": "perimeter_incomplete", "questions": missing, "executed": False}
        if not _filled(envelope.get("source_ref")):
            return {"state": "deferred", "mode": mode,
                    "reason": "source_reference_missing", "executed": False}
        triad = envelope.get("legacy_triad")
        if triad is not None and (not isinstance(triad, dict)
                                  or set(triad) != {"input_a", "input_b", "emergent"}):
            raise PerimeterError("Preserve labelled A/B/emergent triad")
        if not isinstance(envelope.get("payload"), dict):
            raise PerimeterError("Payload must be an object")
        candidate = {
            "schema": "mobiius.heptatic-envelope.v1",
            "mode": mode,
            "perimeter": {q: perimeter[q] for q in QUESTIONS},
            "source_ref": envelope["source_ref"],
            "payload": envelope["payload"],
            "legacy_triad": triad,
        }
        if mode == "replay":
            if not _filled(envelope.get("recorded_event_ref")):
                return {"state": "deferred", "mode": mode,
                        "reason": "recorded_event_required", "executed": False}
            candidate["recorded_event_ref"] = envelope["recorded_event_ref"]
            state = "read_only_replay_plan"
        elif mode == "anti_event":
            if not (_filled(envelope.get("original_event_ref"))
                    and _filled(envelope.get("counterfactual_reason"))):
                return {"state": "deferred", "mode": mode,
                        "reason": "original_and_reason_required", "executed": False}
            candidate["original_event_ref"] = envelope["original_event_ref"]
            candidate["counterfactual_reason"] = envelope["counterfactual_reason"]
            state = "counterfactual_proposal_only"
        else:
            if not (_filled(envelope.get("actor_ref")) and _filled(envelope.get("target_ref"))):
                return {"state": "deferred", "mode": mode,
                        "reason": "actor_target_required", "executed": False}
            candidate["actor_ref"] = envelope["actor_ref"]
            candidate["target_ref"] = envelope["target_ref"]
            state = "requires_host_authorization"
        return {
            "state": state, "mode": mode, "candidate": candidate,
            "candidate_sha256": digest(candidate), "executed": False,
            "external_effects": False, "source_verified": False,
            "policy_authorized": False,
            "control_boundary": (
                "host_authorization_before_any_capture_effect"
                if mode == "capture" else "read_only"),
        }
