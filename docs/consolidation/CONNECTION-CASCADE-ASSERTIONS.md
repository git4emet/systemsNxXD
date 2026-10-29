# Möbii³us connection-cascade assertions (candidate integration)

**Owner:** git4emet/systemsNxXD, per the supplied GitHub reshuffle handoff. **Consumer:** git4emet/XDcomms with its existing pinned Golden Event contract. This change does not revise GoldenEvent bytes. The source hashes are in examples/connection-cascade.json.

## Invariants

1. **One contract owner.** Domain, mobile, operator desktop, Gamma, Asana and Gmail remain projections or provider actions, not separate event cores.
2. **Exact action vocabulary.** Each declared capability is connect, generate, invoke or defer.
3. **Source evidence is not a credential.** A source hash or previous observed connector is not a portable OAuth grant.
4. **Caller / target scope.** An invocation intent must identify the actor, provider, exact target and permitted capability. The host must independently verify actual authorization.
5. **Writes require exact approval.** Mutations require payload-hash matching and one-time nonce; replay protection and freshness are the host gateway's responsibility.
6. **Fail visibly.** Missing connector, approval, context, source or an unsupported adapter results in defer, never fabricated success.
7. **Candidate generation is not invocation.** Generated recipes are candidates only.
8. **Intent digest is not an execution receipt.** SHA-256 asserts recorded bytes, not external truth, signer identity or authority.
9. **Source-status separation.** The AET playbook is a proposal, the public capability registry documents AET's published offerings, and Supabase staging is not a running migrated database.
10. **Professional authority.** Guardian / the seven-gate vocabulary provides advisory review, not permission to file GSOC tickets, perform regulated electrical work or release certified AET reports.

## Observed versus proposed

This ChatGPT session exercised Gmail, GitHub, Asana and Gamma actions. Such actions remain authorized only by the respective host connector. A downloaded Python service cannot inherit those grants. The supplied Dynamic-FCP-Adapter uses a configured authenticated bridge if one is available; no bridge credentials are included here. The Golden Event Bridge remains an unsigned loopback prototype. Supabase archive staging reports no verified active migration.

Run `python3 -m unittest discover -s tests -p 'test_*.py' -v`. This tests planning assertions without calling Gmail, OAuth, Supabase or physical equipment. A production implementation requires authenticated host bindings, capability-specific scope validation, nonce replay storage, receipt persistence and end-to-end tests. No archive contents, emails or credentials are committed.
