# Local Golden Event Bridge

One process owns a coordinate space and a SQLite event history. Registration validates relation keys and destinations. Requests identify the current point, selected avenue, unique event ID, timestamp and source references. A commit failure leaves the point unchanged. An identical retried event ID returns its original receipt; reuse with different content fails. Restart replays the registered path and verifies chained receipt bytes.

`GET /health`, `GET /current`, `POST /select`, and `GET /sse` run on loopback. SSE `id` is the durable database sequence; use it as `Last-Event-ID` or `after` to resume. GoldenEvent `turn_index` is reserved at zero in this prototype. Heartbeats follow a condition wait rather than a polling loop.

This is an unsigned, single-process local prototype. Timestamp and actor fields are caller/context labels. No script strings are evaluated. WebSockets, public authentication, distributed consensus, provider calls and physical adapters are outside this change.
