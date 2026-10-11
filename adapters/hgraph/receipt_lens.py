"""Downstream Python adapter for hgraph 0.8.1; no hgraph-core changes.

Verification happens before ingestion. The graph composes the existing
pass_through operator and preserves a typed scalar on every input tick.
No state, IO, scoring, or transition selection occurs inside the graph.
"""
from dataclasses import dataclass
from hgraph import TS, CompoundScalar, graph, pass_through
from packages.coordinate_core import verify_receipt


@dataclass(frozen=True)
class ReceiptView(CompoundScalar):
    event_id: str
    receipt_sha256: str
    from_point: str
    avenue: str
    to_point: str
    source_receipts: tuple[str, ...]


def ingest_receipt(receipt):
    if not verify_receipt(receipt):
        raise ValueError("receipt digest does not match")
    traversal = receipt["CRED"]["TOFARKLE"]["traversal"]
    return ReceiptView(traversal["event_id"], receipt["receipt_sha256"],
                       traversal["from"], traversal["via"], traversal["to"],
                       tuple(receipt["CRED"]["TOPHDARC"]["source_receipts"]))


@graph
def receipt_lens(receipt: TS[ReceiptView]) -> TS[ReceiptView]:
    return pass_through(receipt)
