"""Coordinate traversal prototype. Selection is supplied by the caller.

No Python if/elif/else or match statements occur in this module. This is a
source-level property, not a claim about interpreter or CPU instructions.
CRED namespace names are retained as receipt containers; no score or
physical resonance calculation is implemented.
"""

from copy import deepcopy
from hashlib import sha256
import json
import os


def canonical_bytes(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"),
                      ensure_ascii=False, allow_nan=False).encode("utf-8")


def seal_receipt(traversal, source_receipts, previous_sha256):
    body = {"CRED": {
        "TOFAR": {"previous_sha256": previous_sha256},
        "TOPHDARC": {"source_receipts": list(source_receipts)},
        "TOFARKLE": {"traversal": deepcopy(traversal)},
    }}
    return {"receipt_sha256": sha256(canonical_bytes(body)).hexdigest(), **body}


def verify_receipt(receipt):
    body = {"CRED": receipt["CRED"]}
    return receipt["receipt_sha256"] == sha256(canonical_bytes(body)).hexdigest()


class JsonlWriter:
    """One-writer local append sink. No claim of immutable storage."""

    def __init__(self, path):
        self.path = path

    def __call__(self, receipt):
        with open(self.path, "ab") as stream:
            stream.write(canonical_bytes(receipt) + b"\n")
            stream.flush()
            os.fsync(stream.fileno())


class DrShiftStateEngine:
    """Resolve avenues, consume a supplied selection, record the traversal.

    Scripts are recorded descriptors. This prototype does not execute script
    strings, invoke external tools, or actuate devices. Input registration and
    unique event IDs belong to the calling application.
    """

    def __init__(self, point, correlate_space, append_receipt,
                 previous_sha256="0" * 64):
        self._space = deepcopy(correlate_space)
        self._space[point]
        self._point = point
        self._append = append_receipt
        self._previous_sha256 = previous_sha256
        self._lut = {(r["from"], r["avenue"]): r
                     for avenues in self._space.values() for r in avenues}

    @property
    def point(self):
        return self._point

    def available_avenues(self):
        return {"point": self._point,
                "available_avenues": deepcopy(self._space[self._point])}

    def shift_where(self, avenue_id, *, event_id, timestamp,
                    source_receipts=()):
        relation = self._lut[(self._point, avenue_id)]
        self._space[relation["to"]]
        traversal = {
            "event_id": event_id,
            "from": self._point,
            "via": relation["avenue"],
            "to": relation["to"],
            "script": relation["script"],
            "timestamp": timestamp,
        }
        receipt = seal_receipt(traversal, source_receipts,
                               self._previous_sha256)
        self._append(deepcopy(receipt))
        self._point = relation["to"]
        self._previous_sha256 = receipt["receipt_sha256"]
        return receipt


_AXIS_42 = {i: i for i in range(42)}
_BANDS_3 = {i: i for i in range(3)}
_DOMAINS_8 = {i: i for i in range(8)}


def project_face(canonical_address, band, domain):
    """A many-to-one view which carries the complete input address."""
    address = deepcopy(canonical_address)
    _AXIS_42[address["omega_id"]]
    alpha = _AXIS_42[address["alpha_id"]]
    b, d = _BANDS_3[band], _DOMAINS_8[domain]
    lane = alpha % 8
    return {"canonical_address": address,
            "projection": {"band": b, "domain": d, "lane": lane,
                           "face": 64 * b + 8 * d + lane}}
