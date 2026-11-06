# Civic Moonflowers and Legacy Router Source-Facet Extraction

**Sources inspected:** `git4emet/civic-moonflowers`, `git4emet/mobiius-ops-console`, and the shared `systemsNxXD` repository.  
**Status:** source-recovered for readable files; claims in manifest documents remain attributed claims unless separately tested.

## 1. `civic-moonflowers/src/lib/schema.ts`

The TypeScript schema exports:
- TOFAR vocabulary: Trust, Open, Fair, Accountable, Reusable.
- An eight-verb MOBIUS_LOOP sequence: Sense, Parse, Route, Execute, Witness, Reflect, Receive, Return.
- Four Dollhouse states: Welcome/Open a door, Build/Make a room, Repair/Fix a loop, Return/Leave a receipt.
- Origami shortcuts for Fold Map, Receipt/Witness, Prompt Surface, Habitat Scene, Research Surface, and Prism Transform.
- CatLabs nodes for adaptive set, live show, audience link, signal flow, and control surface.
- A five-stage Starfleet pipeline: source acquisition, ingest/classify, summary/insight, yearbook integration, signatures/sharing.
- Eight domain hosts and their declared product roles.
- Six room types: Control Room, Capture Studio, Publishing Bay, Workshop, Leaderboard, and Check-in.
- Button/action identifiers for DNS verification, WordPress/EasyWP, email, SSL, podcast RSS, CRED sharing, flood harvest, and barren-plateau repair.
- WordPress FrontEdit block names.

These are product-surface vocabulary, room models, action identifiers, and workflow descriptors. They are not the canonical coordinate traversal. In particular, the eight-step MOBIUS_LOOP and four Dollhouse states are separate product/concept sequences and must not replace the current point → correlate space → available avenues → caller selection contract.

## 2. `partychain_vision_for_everybody_hypergraph_20260704.json`

The file declares a read-only expanded synthesis and a no-mutation boundary. It contains:
- product and room surfaces: PartyChain, CatLabs/House Party/Studio, future person-owned SmartMirror;
- rails: Gmail draft/send, visible contact picker, Canva design source;
- kernel surfaces: Guardian, Archive/Ledger, Buddy;
- overlay and importer surfaces: hOiSt overlay and DeepSeek thread ecosystem importer;
- person-role nodes: Host, Guest/Cousin, Helper, Quiet/missed person, Builder;
- eleven directed relationships describing invite creation, recipient selection, drafting, reply entry, ledger logging, visual vocabulary, overlays, thread import, room skinning, and Buddy assistance;
- a source manifest containing named ZIP, PDF, PowerShell, image, and application artifacts with byte counts and SHA-256 values.

**Representation finding:** despite its title, this JSON uses `nodes` plus binary `edges` with `from` and `to`. It does not contain a `hyperedges` collection or arbitrary participant sets. Preserve it as a directed pairwise graph unless a separate source defines higher-order relationships.

Guardian is labelled a `policy_gate` in this product-specific graph. That is a source-level product design claim, not a coordinate-core primitive. Keep any external consent, sending, sharing, authentication, or authorization controls at their actual application/execution boundary; do not add them as avenue ranking or selection semantics.

## 3. `civic-moonflowers/attachments/ManifestSKILLmanifests.md`

The readable manifest defines a proposed skill named `prvpda-carrier-modulation`, described as PPPVPDCMAS / PRVPDA research synthesis. It declares triggers and output conventions, and maps these domain tags and code concepts:
- Caputo fractional-gradient history;
- E8/geometric constant anchoring;
- carrier-phase modulation;
- projective/homogeneous coordinates;
- Mamba selective-state context compression;
- Elastic Weight Consolidation;
- ESP32 dedicated-GPIO bit-banging;
- I2S DMA parallel mode;
- ESP32-S3 SIMD;
- distributed ESP32 mesh/GPU;
- LEDC hardware carrier generation;
- self-organized criticality;
- Guardian gate concepts;
- CRED contribution accounting;
- shift-tupled rainbow-table indexing;
- ESP32 register-level GPIO operations and vector instructions.

The manifest names candidate scripts `carrier_modulation_engine.py` and `esp32_mesh_gpu.py`, plus evaluation cases. The current repository tree search did not find those script paths in `civic-moonflowers`; their implementation is therefore not source-verified by this pass.

### Evidence handling for this manifest

The document contains strong assertions about mathematical guarantees, measured speedups, hardware throughput, gradient preservation, and specific carrier behavior. Those remain claims made by the manifest. They must be individually checked against the cited papers, hardware documentation, source code, and repeatable measurements before being recorded as externally validated findings.

The declared `VERIFIED`, `EXTERNAL_LIT`, `DESIGN_SPEC`, `HYPOTHESIS`, and `IMPLEMENTATION_CLAIM` labels are source vocabulary. They are not automatically adopted as the canonical project evidence states.

The proposed “shift-tupled rainbow table” format contains a sequence and tail pointer/ring convention. That is not by itself a hypergraph schema: it does not define arbitrary participant sets or incidence structure.

## 4. `civic-moonflowers/attachments/Recent arXiv folds into Buddy Skills.txt`

The repository tree identifies this artifact at 2,722,288 bytes. GitHub's UTF-8 file extraction returned an empty body, and base64 retrieval also returned no content. It has not been parsed. Keep it in the source inventory as an unparsed artifact; do not infer its contents from its filename.

The adjacent `3D_agent_shared_skill_schema_mapping.pdf` is 152,711 bytes. It was identified in the repository tree, but its PDF body was not extracted in this pass.

## 5. `mobiius-ops-console/src/router/hypergraph.py`

The 1,165-line file declares:
- `Phase`, `ToroidalAddress`, and `ModeAddress`;
- phase-to-band/domain and toroidal-to-mode projection;
- `FrozenDict` deep immutability helper;
- event records with source agent, source skill, model version, timestamp, trust score, Guardian verdict, and provenance hash;
- `TOFARService` append/hash-chain and chain verification;
- `SevenGates` evaluation;
- `ToroidalNode` and `OmegaTorus` over a 42×42 node grid;
- CRED request validation and DI extraction;
- agent capability registry and validation;
- artifact records and artifact service;
- `HypergraphRouter.route_tool_call`;
- a merge-gate demonstration function.

**Representation finding:** the filename/class name says “hypergraph,” but the inspected implementation has zero `hyperedge`, `incidence`, or participant-set declarations. It models a 42×42 address/node grid and tool-call routing, not a general mathematical hypergraph.

**Canonical separation:** this is explicitly marked prototype/production-unsafe in its own header. It contains trust-floor checks, seven-gate evaluation, Guardian verdicts, rejection receipts, DI, and allow/reject tool-call routing. Those are historical router behavior and are excluded from the current coordinate core. Reusable isolated capabilities include address projection, event serialization, append/hash-chain mechanics, tamper detection, immutable event payload patterns, capability registry structure, artifact lifecycle, schema validation, and source attribution. Reuse must not carry over the old gating or scoring semantics.

## 6. Existing shared HGraph adapter

The shared repository also contains `adapters/hgraph/receipt_lens.py` and `test_receipt_lens.py`. The adapter:
- verifies a TOFAR receipt before ingestion;
- converts it into a typed `ReceiptView` scalar;
- passes the scalar through an HGraph graph using `pass_through`;
- preserves event ID, receipt hash, from-point, avenue, to-point, and source receipt references.

Its tests describe multi-tick, no-tick, replay, and tampered-receipt cases. These tests are present; they were not executed in this parsing pass. This is a typed temporal receipt lens, not a general hypergraph or persistent-homology implementation.

## 7. Requisite function/skill facets

This source pass contributes the following function families to the Function Graph:
- product surface and room schema declaration;
- action identifier and button catalog declaration;
- domain-to-role mapping;
- workflow stage representation;
- person-role and collaboration relationship representation;
- pairwise directed graph serialization;
- source manifest and artifact hash registration;
- typed receipt conversion;
- receipt verification before stream ingestion;
- time-series scalar pass-through;
- address and face projection;
- immutable event payload representation;
- append-only hash-chain recording and verification;
- capability declaration and lookup;
- artifact lifecycle and serialization;
- schema validation;
- carrier modulation design;
- fractional derivative/memory-kernel design;
- projective coordinate transformation design;
- Mamba/EWC model-adapter design;
- ESP32 GPIO, I2S, SIMD, LEDC, and mesh-compute design.

Each facet remains source-linked and separately evidence-typed. Related functions may later participate in multiple skills and systems.
