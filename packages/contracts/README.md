# Shared coordinate contracts

`systemsNxXD` owns `golden-event.ts`. `XDcomms` consumes a hash-checked copy pinned to a reviewed commit; it does not own a second transition table.

GoldenEvent v1 includes the original event ID, source receipt references, the full CRED receipt, dirty sectors and the exact UTF-8 receipt body used for SHA-256. Consumers compare the body with the structured receipt before checking its digest. This avoids JSON number-format differences across Python and JavaScript.

The bridge is local and single-process. `actor: local-selection` is a descriptor, not an authenticated identity. `turn_index: 0` is a reserved compatibility value; the SSE `id` is the durable sequence cursor. A digest establishes consistency with those bytes, not author identity, external truth, immutability, or authorization.

The coordinate core enumerates avenues and consumes an explicit selection. Historical trust floors, frequencies, scores and Guardian gates are not inputs to this contract. UI metadata from older exports stays attributed as historical material.

The 42×42 address grid contains 1,764 coordinate pairs. The 3×8×8 face view contains 192 slots. Face projection keeps its contributing canonical address. No 32-dimensional affine basis, offset or physical quadratic model has been supplied for implementation here.
