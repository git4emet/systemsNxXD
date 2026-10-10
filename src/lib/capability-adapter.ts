export type SourceRef = { repositoryId: string; repository: string; commit: string; path: string; blob: string };
export type Point = { id: string; context: string[] };
export type Capability = { id: string; label: string; contexts: string[]; source: SourceRef };
export type Transition = { id: string; from: Point; to: Point; capabilityId: string; source: SourceRef; outcome: 'completed' | 'failed'; transport: 'local' | 'http'; timestamp: string; script: { capabilityId: string; transport: 'local' | 'http'; input: unknown } };
export type Runner = (input: unknown) => Promise<unknown>;
export type Binding = { capabilityId: string; transport: 'local' | 'http'; run: Runner };

/** Dr. Shift wHERE: outcome events select the next point from an explicit table. */
export const TRANSITION_TABLE = {
  completed: (point: Point, eventId: string): Point => ({ id: eventId, context: [...point.context] }),
  failed: (point: Point, _eventId: string): Point => point,
};

/** Context intersection exposes avenues in their registered order, without a score. */
export function discover(capabilities: Capability[], point: Point): Capability[] {
  return capabilities.filter(c => c.contexts.length === 0 || c.contexts.some(x => point.context.includes(x)));
}

export function providerUrl(value: string): string {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('Use an HTTP(S) provider URL without embedded credentials.');
  return url.href;
}

/** A generated module accepts a real runner; generation does not create a backend. */
export function generateAdapter(capability: Capability) {
  const contract = { version: 1, capabilityId: capability.id, source: capability.source, input: { type: 'unknown' }, output: { type: 'unknown' }, connection: { state: 'unbound', requirement: 'Supply an executable local runner or an HTTP provider that implements this contract.' } };
  const module = `export const contract = ${JSON.stringify(contract, null, 2)};\nexport function connect(run) {\n  if (typeof run !== 'function') throw new TypeError('An executable runner is required');\n  return { contract, invoke: async input => run(input) };\n}\n`;
  return { contract, module };
}

export function connectHttp(capability: Capability, endpoint: string, fetcher: typeof fetch = fetch): Binding {
  const url = providerUrl(endpoint);
  return { capabilityId: capability.id, transport: 'http', run: async input => {
    const response = await fetcher(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ capabilityId: capability.id, input, source: capability.source }), signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Provider returned HTTP ${response.status}`);
    return response.json();
  } };
}

/** Explicit selection executes once. Failure retains the current point and is recorded. */
export async function executeSelected(point: Point, capability: Capability, binding: Binding, input: unknown, record: (event: Transition) => void, makeId: () => string = () => crypto.randomUUID()) {
  if (binding.capabilityId !== capability.id) throw new Error('Connection belongs to a different capability');
  const eventId = makeId();
  let output: unknown;
  let failure: unknown;
  let failed = false;
  try { output = await binding.run(input); } catch (error) { failed = true; failure = error; }
  const outcome = (['completed', 'failed'] as const)[Number(failed)];
  const to = TRANSITION_TABLE[outcome](point, eventId);
  const event: Transition = { id: eventId, from: point, to, capabilityId: capability.id, source: capability.source, outcome, transport: binding.transport, timestamp: new Date().toISOString(), script: { capabilityId: capability.id, transport: binding.transport, input } };
  record(event);
  if (failed) throw failure;
  return { point: to, output, event };
}
