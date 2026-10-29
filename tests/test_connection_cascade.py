import copy
import json
from pathlib import Path
import unittest
from services.connection_cascade import ConnectionRegistry, CascadeError, canonical_sha256

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = json.loads((ROOT / "examples/connection-cascade.json").read_text(encoding="utf-8"))


class CascadeAssertions(unittest.TestCase):
    def setUp(self):
        self.reg = ConnectionRegistry(copy.deepcopy(MANIFEST))
        self.binding = {"provider": "github", "actor_ref": "actor:david", "target_ref": "repo:git4emet/systemsNxXD",
                        "allowed_capabilities": ["github.repo.read", "github.repo.write"]}

    def test_manifest_has_unique_capability_and_exact_actions(self):
        self.assertEqual(len(self.reg.capabilities), len(MANIFEST["capabilities"]))
        self.assertTrue({"connect", "generate", "invoke", "defer"}.issubset({c["action"] for c in MANIFEST["capabilities"]}))

    def test_no_credential_or_cross_provider_grants_in_manifest(self):
        txt = json.dumps(MANIFEST).lower()
        for key in ('"access_token"', '"refresh_token"', '"client_secret"', '"api_key"', '"password"'):
            self.assertNotIn(key, txt)
        self.assertFalse(MANIFEST.get("authorization_cascade_enabled", False))

    def test_unknown_capability_defers_not_fabricates_success(self):
        self.assertEqual(self.reg.plan("missing", actor_ref="a", target_ref="t", payload={})["state"], "deferred")

    def test_generate_remains_candidate_without_invocation(self):
        r = self.reg.plan("fcp.recipe.generate", actor_ref="a", target_ref="t", payload={"x": 1})
        self.assertEqual(r["state"], "candidate_only")
        self.assertFalse(r["invoked"])

    def test_missing_binding_rejected_despite_observed_connector(self):
        r = self.reg.plan("github.repo.read", actor_ref="actor:david", target_ref="repo:git4emet/systemsNxXD", payload={})
        self.assertEqual(r["reason"], "missing_caller_bound_connection")

    def test_wrong_actor_and_target_rejected(self):
        for actor, target in [("actor:other", "repo:git4emet/systemsNxXD"), ("actor:david", "repo:wrong")]:
            result = self.reg.plan("github.repo.read", actor_ref=actor, target_ref=target,
                                   payload={}, binding=self.binding)
            self.assertEqual(result["state"], "deferred")

    def test_read_plan_is_not_automatically_invoked(self):
        r = self.reg.plan("github.repo.read", actor_ref="actor:david", target_ref="repo:git4emet/systemsNxXD",
                          payload={}, binding=self.binding)
        self.assertEqual(r["state"], "ready_for_host_validation")
        self.assertFalse(r["invoked"])
        self.assertEqual(r["intent_sha256"], canonical_sha256(r["intent"]))

    def test_write_requires_exact_action_approval(self):
        kwargs = dict(actor_ref="actor:david", target_ref="repo:git4emet/systemsNxXD",
                      payload={"path": "docs/test.md", "content": "x"}, binding=self.binding)
        self.assertEqual(self.reg.plan("github.repo.write", **kwargs)["reason"], "exact_action_approval_required")
        approval = {"actor_ref": "actor:david", "target_ref": kwargs["target_ref"],
                    "capability": "github.repo.write", "payload_hash": canonical_sha256(kwargs["payload"]),
                    "one_time_nonce": "host-issued-nonce"}
        self.assertEqual(self.reg.plan("github.repo.write", **kwargs, approval={**approval, "payload_hash": "wrong"})["state"], "deferred")
        self.assertEqual(self.reg.plan("github.repo.write", **kwargs, approval=approval)["state"], "ready_for_host_validation")

    def test_proposed_integration_cannot_be_marked_live(self):
        r = self.reg.plan("supabase.archive.read", actor_ref="a", target_ref="supabase:unknown", payload={},
                          binding={"provider": "supabase", "actor_ref": "a", "target_ref": "supabase:unknown",
                                   "allowed_capabilities": ["supabase.archive.read"]})
        self.assertEqual(r["reason"], "connector_not_verified")

    def test_manifest_rejects_mutation_without_auth(self):
        wrong = copy.deepcopy(MANIFEST)
        wrong["capabilities"][0]["side_effect"] = True
        wrong["capabilities"][0]["auth_mode"] = "none"
        with self.assertRaises(CascadeError): ConnectionRegistry(wrong)

    def test_defer_is_non_executable(self):
        r = self.reg.plan("aet.report.release", actor_ref="a", target_ref="t", payload={})
        self.assertEqual(r["state"], "deferred")


if __name__ == "__main__":
    unittest.main()
