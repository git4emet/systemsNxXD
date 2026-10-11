# Möbii³us / DoinBetter consolidation

This review branch gives the coordinate runtime and Golden Event contract one source owner. The existing Canon Bind application now lives under `apps/adapter-console`; its imports under `src/` remain compatibility shims. Capability and historical assessment data live under `packages/capability-registry`.

The coordinate primitive is current point, correlate space, available avenues, explicit selection, recorded transition and new point. `packages/coordinate_core` implements this lookup without Python conditional statements. This is a source-level property, not a guarantee about CPU branches or execution time. CRED retains TOFAR, TOPHDARC and TOFARKLE as receipt namespaces. The coordinate core performs no ranking or trust scoring.

## Run and check

```sh
npm ci
npm run typecheck
npm test
npm run build
python3 -m unittest discover -s tests -p 'test_*.py' -v
python3 -m services.golden_event_bridge.http_server --space examples/octave-space.json --database /tmp/mobiius-review.sqlite --port 8765
```

The bridge binds to loopback. `GET /current` exposes avenues, `POST /select` records a supplied choice, and `GET /sse` replays committed events. Scripts are recorded descriptors. This demo has no public authentication, WebSocket transport or physical actuation.

The optional hgraph adapter uses hgraph 0.8.1. Install `adapters/hgraph/requirements.txt`, then run `python3 -m unittest adapters.hgraph.test_receipt_lens -v`. It passes verified receipt identities through a typed graph lens. It does not own transitions.

## Ownership and evidence

See [the repository map](docs/consolidation/REPOSITORY-MAP.md), [follow-up review notes](docs/consolidation/PR-NOTES.md), and [the shared contract](packages/contracts/README.md). `XDcomms` consumes a digest-checked snapshot pinned to a review commit in this repository.

The adapter-console requires an explicit destination choice before connecting an artifact. Archived hints and the historical assessment remain visible as source context. Receipts record selected paths and byte digests. They do not authenticate an actor or certify that an assertion is true.

The 42×42 address space has 1,764 positions. The 3×8×8 display has 192 faces and carries the contributing canonical address. It is a many-to-one projection. A separate 192×192 structure and a proposed 32-dimensional affine stub are not replacements for either count. The affine basis, units and inverse remain unspecified.

Everybody DoinBetter Together.
