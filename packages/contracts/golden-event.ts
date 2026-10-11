/** Contract owner: git4emet/systemsNxXD. Receipts attest recorded bytes only. */
export interface Traversal {
  event_id: string;
  from: string;
  via: string;
  to: string;
  script: unknown;
  timestamp: string;
}
export interface Receipt {
  receipt_sha256: string;
  CRED: {
    TOFAR: { previous_sha256: string };
    TOPHDARC: { source_receipts: string[] };
    TOFARKLE: { traversal: Traversal };
  };
}
export interface GoldenEvent {
  schema: "mobiius.golden-event.v1";
  event_id: string;
  ts: string;
  kind: "coordinate.traversal";
  actor: string;
  thread_id: string;
  turn_index: number;
  content: string;
  extract: { point: string; avenue: string };
  links: string[];
  tofar: Receipt;
  dirty_sectors: string[];
  metadata: { canonical_receipt_body: string };
}
export interface Selection {
  event_id: string;
  from_point: string;
  avenue_id: string;
  timestamp: string;
  source_receipts: string[];
}

/** Structural JSON comparison; hashing uses the exact server-supplied UTF-8 body. */
function orderedJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(orderedJson).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const object = value as Record<string, unknown>;
    return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${orderedJson(object[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

/** Validate before a consumer redraws or accepts an event cursor. No signer authentication. */
export async function validateGoldenEvent(input: unknown): Promise<GoldenEvent> {
  const event = input as GoldenEvent;
  if (!event || event.schema !== "mobiius.golden-event.v1" || event.kind !== "coordinate.traversal") {
    throw new Error("Unsupported GoldenEvent schema");
  }
  const body = event.metadata?.canonical_receipt_body;
  if (typeof body !== "string" || orderedJson(JSON.parse(body)) !== orderedJson({ CRED: event.tofar?.CRED })) {
    throw new Error("Receipt body does not match the event");
  }
  const bytes = new TextEncoder().encode(body);
  const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), (v) => v.toString(16).padStart(2, "0")).join("");
  if (digest !== event.tofar.receipt_sha256 || !/^[0-9a-f]{64}$/.test(event.tofar.CRED.TOFAR.previous_sha256)) {
    throw new Error("Receipt digest does not match");
  }
  const t = event.tofar.CRED.TOFARKLE.traversal;
  if ([t.event_id, t.from, t.via, t.to, t.timestamp, event.actor, event.thread_id, event.content].some((v) => typeof v !== "string")
      || !("script" in t) || event.event_id !== t.event_id || event.ts !== t.timestamp
      || event.extract?.point !== t.to || event.extract?.avenue !== t.via
      || !Array.isArray(event.links) || !event.links.every((v) => typeof v === "string")
      || orderedJson(event.links) !== orderedJson(event.tofar.CRED.TOPHDARC.source_receipts)
      || !Array.isArray(event.dirty_sectors) || !event.dirty_sectors.every((v) => typeof v === "string")
      || !Number.isInteger(event.turn_index)) {
    throw new Error("Event wrapper does not match its traversal");
  }
  return event;
}
