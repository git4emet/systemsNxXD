# Repository ownership map

See [multi-domain infrastructure](MULTI-DOMAIN-INFRASTRUCTURE.md) for the eight-domain roster, Gemini's contributed shared-services target and the distinction between proposed services and current implementation.

| Surface | Review disposition | Evidence and boundary |
|---|---|---|
| `systemsNxXD` | Own shared coordinate runtime, event contract and adapter console | This branch moves six implementation files into `apps/` and `packages/` with compatibility shims |
| `XDcomms` | Consume shared events and provide communications adapters | Pinned contract copy, SSE parser, explicit selection client and consumer tests |
| `ContactResumes` | Retain as an attributed ingestion adapter candidate | Its README identifies Skill Seekers v3.7.0 and the upstream Skill Seekers project; the repository name does not describe the code |
| `roundcubemall` | Keep upstream mail software behind an adapter | README identifies Roundcube Webmail and its GPL license with stated exceptions |
| `stateStateColorStates` | Keep upstream plugin attribution | README identifies Roundcube TaskWatermark; it is not evidence of a Möbii³us state core |
| `roundcube-contextmenu` | Review as a mail plugin integration | PHP/JavaScript plugin tree; retain original license and authorship |
| DoinBetter floodwater / survey / fractal repos | Retain domain specifications | Documentation alone does not establish deployed services or field findings |
| WebGPU / WASM experiments | Preserve independently until reproduced | Isolate browser and device requirements before importing capabilities |
| Other app and Grok exports | Compare source blobs and behavior first | Preserve unique files, manifests, histories and upstream attribution |

The two focus main trees share 342 byte-identical file paths at the inspected snapshots. `systemsNxXD` has 41 additional paths. This PR creates an ownership boundary; it does not delete the duplicated historical frontend from `XDcomms`.

No repository deletion or archive conversion is included. Each later migration needs a reviewed source map, license attribution, behavior comparison and a focused PR. Account exports and personal correspondence remain outside public code.
