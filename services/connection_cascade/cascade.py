"""Evidence-bound connector planning surface for Möbii³us.

Plans are not invocations. Live connected tools MUST run through their existing
host authorization checks; no bearer token or OAuth grant crosses providers.
"""
import hashlib
import json
from pathlib import Path
from typing import Any

ACTIONS = frozenset(("connect", "generate", "invoke", "defer"))
AUTH_MODES = frozenset(("caller_connection", "provider_owned", "none"))
EVIDENCE = frozenset(("live_tool_observed", "local_source_inspected", "proposal_only"))


def canonical_sha256(obj: Any) -> str:
    return hashlib.sha256(json.dumps(obj, sort_keys=True, ensure_ascii=False,
                   allow_nan=False, separators=(",", ":")).encode("utf-8")).hexdigest()


class CascadeError(ValueError):
    pass


class ConnectionRegistry:
    """Read-only catalogue plus validated execution INTENTS, never delegated grants."""

    def __init__(self, manifest: dict):
        self.manifest = manifest
        if manifest.get("schema") != "mobiius.connection-cascade.v1":
            raise CascadeError("Unsupported manifest schema")
        sources = manifest.get("sources", [])
        for source in sources:
            if not isinstance(source.get("sha256"), str) or len(source["sha256"]) != 64:
                raise CascadeError("Each source must retain a SHA-256 digest")
        capabilities = manifest.get("capabilities", [])
        self.capabilities = {}
        for cap in capabilities:
            cid = cap.get("id")
            if not isinstance(cid, str) or not cid or cid in self.capabilities:
                raise CascadeError("Capability IDs must be unique and nonempty")
            if cap.get("action") not in ACTIONS or cap.get("auth_mode") not in AUTH_MODES:
                raise CascadeError("Invalid action or authentication mode")
            if cap.get("evidence_status") not in EVIDENCE:
                raise CascadeError("Invalid evidence status")
            if cap.get("auth_mode") == "none" and cap.get("side_effect"):
                raise CascadeError("Unauthenticated capability cannot mutate")
            if cap["action"] == "defer" and cap.get("side_effect"):
                raise CascadeError("Defer cannot mutate")
            if cap["action"] == "generate" and cap.get("side_effect"):
                raise CascadeError("Generation is candidate-only")
            if cap["action"] == "invoke" and not cap.get("provider_action"):
                raise CascadeError("Invocation needs a declared provider action")
            if any(k in cap for k in ("access_token", "refresh_token", "client_secret", "api_key", "password")):
                raise CascadeError("Never serialize credentials in capabilities")
            self.capabilities[cid] = cap

    @classmethod
    def from_path(cls, path: str | Path):
        return cls(json.loads(Path(path).read_text(encoding="utf-8")))

    def probe(self, capability_id: str) -> dict:
        cap = self.capabilities.get(capability_id)
        if cap is None:
            return {"capability": capability_id, "status": "unknown", "action": "defer"}
        return {"capability": capability_id, "status": cap["evidence_status"],
                "action": cap["action"], "auth_mode": cap["auth_mode"],
                "provider_action": cap.get("provider_action"),
                "side_effect": bool(cap.get("side_effect"))}

    def plan(self, capability_id: str, *, actor_ref: str, target_ref: str,
             payload: dict, binding: dict | None = None, approval: dict | None = None) -> dict:
        """Return a content-addressed intent; DOES NOT perform any tool call.

        binding and approval are assertions to be revalidated by the host
        gateway. Their presence alone is not authenticated authorization.
        """
        if capability_id not in self.capabilities:
            return {"state": "deferred", "reason": "capability_not_registered", "capability": capability_id}
        cap = self.capabilities[capability_id]
        if not isinstance(payload, dict) or not actor_ref or not target_ref:
            raise CascadeError("Actor, target and object payload are required")
        payload_hash = canonical_sha256(payload)
        if cap["action"] == "defer":
            return {"state": "deferred", "reason": "manifest_defer", "capability": capability_id}
        if cap["action"] == "generate":
            return {"state": "candidate_only", "capability": capability_id,
                    "payload_hash": payload_hash, "invoked": False}
        if cap["evidence_status"] == "proposal_only":
            return {"state": "deferred", "reason": "connector_not_verified", "capability": capability_id}
        if cap["auth_mode"] != "none":
            if not isinstance(binding, dict) or binding.get("provider") != cap.get("provider") or binding.get("actor_ref") != actor_ref:
                return {"state": "deferred", "reason": "missing_caller_bound_connection", "capability": capability_id}
            if binding.get("target_ref") != target_ref or cap["id"] not in binding.get("allowed_capabilities", []):
                return {"state": "deferred", "reason": "connection_scope_mismatch", "capability": capability_id}
        if cap.get("side_effect"):
            if not isinstance(approval, dict) or any((
                approval.get("actor_ref") != actor_ref,
                approval.get("target_ref") != target_ref,
                approval.get("capability") != capability_id,
                approval.get("payload_hash") != payload_hash,
                not approval.get("one_time_nonce"),
            )):
                return {"state": "deferred", "reason": "exact_action_approval_required", "capability": capability_id}
        intent = {"capability": capability_id, "actor_ref": actor_ref, "target_ref": target_ref,
                  "payload_hash": payload_hash, "provider": cap.get("provider"),
                  "provider_action": cap.get("provider_action"),
                  "side_effect": bool(cap.get("side_effect")),
                  "approval_nonce": approval.get("one_time_nonce") if cap.get("side_effect") else None}
        return {"state": "ready_for_host_validation", "invoked": False,
                "intent": intent, "intent_sha256": canonical_sha256(intent),
                "warning": "Not an authorization. Host must validate connection, scope, approval and replay."}
