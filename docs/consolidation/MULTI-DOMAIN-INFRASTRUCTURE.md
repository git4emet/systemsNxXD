# Multi-domain infrastructure and shared services

Gemini's contribution describes a shared-services target for eight public domains. The supplied list contains six names; the established eight-domain roster also includes `doinbetter.org` and `heymico.org`. This note preserves the contribution and reconciles it with the code in this draft PR.

## Contributed source

User-supplied text attributed to Gemini, received 2026-10-11:

> 4. Multi-Domain Infrastructure & Shared Services
> Eight sovereign domains (doinbetter.com, heymico.com, timmyu.in, tailly.cc, winxm.art, ahig.xyz) operate on a unified platform backend:
> Single Sign-On (OAuth 2.1 / OIDC / PKCE): Unified role-based identity management.
> Golden Event Bridge: FastAPI/Uvicorn runtime streaming updates concurrently via WebSockets and Server-Sent Events (SSE).
> FizzyScreen HUD: Selective dirty-sector SVG DOM rendering driven by incoming event streams. (GEMINI contributed:)

The passage is a contributed architecture description. It is not a deployment receipt.

## Eight-domain roster

These are user-defined public roles from the concurrent-build specification. This table does not assert verified DNS, hosting directories or running services.

| Domain | Assigned public role |
|---|---|
| `doinbetter.com` | Coordinate projects |
| `doinbetter.org` | Community governance |
| `heymico.com` | Listen |
| `heymico.org` | Speak |
| `timmyu.in` | Identity and authentication |
| `tailly.cc` | Community and CRED |
| `winxm.art` | Creative rendering |
| `ahig.xyz` | Visualization and theLab |

The domain roster is a deployment surface. The eight-step Sense → Parse → Route → Execute → Witness → Reflect → Receive → Return loop is a process; its cardinality does not assign domains to steps.

## Target and current evidence

| Shared service | Contributed target | Implemented in this draft PR | Remaining evidence |
|---|---|---|---|
| Shared identity | OAuth 2.1 / OIDC / PKCE SSO with roles across the domains | No public authentication; current actor labels do not authenticate callers | Provider configuration, registered clients and exercised login/logout and role boundaries across the intended sites |
| Golden Event Bridge | FastAPI/Uvicorn with WebSockets and SSE | Loopback `ThreadingHTTPServer`, SQLite receipt history, explicit `POST /select` and resumable `GET /sse` | A reviewed FastAPI/WS adapter retaining the event contract, commit-before-advance behavior, replay and request idempotency |
| FizzyScreen HUD | Incoming events redraw affected SVG sectors | GoldenEvent carries `dirty_sectors`; the TypeScript contract validates them as strings | A sector-to-SVG binding, recorded end-to-end redraw behavior and explicit human action controls |
| Unified public backend | Eight sites consume shared services | Coordinate core, shared contract and an XDcomms consumer; local and CI checks cover these components | Verified domain-to-runtime routing and a deployed cross-domain integration exercise |

Code evidence: [local bridge](../../services/golden_event_bridge/README.md), [HTTP implementation](../../services/golden_event_bridge/http_server.py), [event construction](../../services/golden_event_bridge/bridge.py), and [shared contract](../../packages/contracts/golden-event.ts). The published checks for the implementation commit are linked in the draft PR.

The 42×42 canonical address space and 192-face projection retain their existing counts. A domain or HUD sector is a view or route; it does not replace canonical identity. Receipt hashes verify recorded bytes and do not authenticate a signer or establish the truth of a service-status claim.

## Focused follow-up PRs

1. **Shared identity:** introduce provider/client configuration and verify login, logout and denied role access before describing the eight-site SSO as operational.
2. **Transport adapter:** add FastAPI/Uvicorn and WebSocket delivery behind the shared contract; verify retries, resume, disconnects and slow consumers.
3. **FizzyScreen consumer:** map declared sectors to SVG nodes and verify that unaffected sectors remain unchanged while explicit selection preserves source identity.
4. **Domain wiring:** reconcile the eight actual hosting targets with the shared service routes and record the resulting deployment evidence.

This documentation update adds no runtime transport, authentication or deployment. XDcomms can continue using its pinned implementation commit because the shared contract bytes are unchanged.
