# Shared Möbii³us Skills

This repository owns the shared coordinate runtime, Golden Event contract, and adapter console.

## Canonical registries

- [Conversation-recovered prototype and requisite-skill atlas](docs/skills/CONVERSATION_RECOVERED_SKILL_ATLAS.md)
- [Machine-readable requisite-skill registry](docs/skills/requisite-skills.registry.yaml)
- [Repository ownership map](docs/consolidation/REPOSITORY-MAP.md)
- [Shared coordinate contracts](packages/contracts/README.md)

## Skills represented by code in this repository

- Coordinate space loading and available-avenue enumeration.
- Explicit caller-supplied avenue selection.
- Traversal instantiation and script descriptor recording.
- Canonical receipt serialization and digest sealing.
- Previous-receipt linkage and receipt verification.
- Many-to-one face projection that retains canonical address identity.
- SQLite event persistence and replay.
- Commit-before-state-advance behavior.
- Idempotent selection handling and stale-point detection.
- HTTP current-point and selection endpoints.
- SSE event publication and sequence-based replay.
- Golden Event construction and structural validation.

## Canonical traversal contract

The coordinate core exposes the current point and its available avenues. The caller supplies the selection. The core records the selected traversal and script, then advances the current point.

It does not rank, prioritize, recommend, score, approve, deny, or otherwise evaluate available avenues.

## Evidence boundary

The Python coordinate and bridge modules and their tests are present in this repository. Test files were inspected when this registry was assembled; test execution and production deployment are not asserted here. The documented HTTP bridge is loopback-only and is not an authenticated public service.

## Consumers and domain repositories

- [XDcomms](https://github.com/git4emet/XDcomms) consumes the pinned Golden Event contract and provides transport-side decoding, receipt validation, checkpoints, and explicit selection.
- [DoinBetter-Floodwater](https://github.com/git4emet/DoinBetter-Floodwater) owns floodwater / GSOC / AHJ / drill-coordination domain skills.
- [DoinBetter-Fractal-Whisper](https://github.com/git4emet/DoinBetter-Fractal-Whisper) owns the heyMicojava SVG tilesheet builder and speech-to-text prototype context.
- The WebGPU repositories retain their separate compute and visualization capabilities.

Do not duplicate the coordinate transition table in consumers. Keep the shared contract and runtime here.
