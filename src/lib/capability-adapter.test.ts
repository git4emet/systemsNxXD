import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { connectHttp, discover, executeSelected, generateAdapter, providerUrl, type Capability, type Transition } from './capability-adapter.ts';
const capability: Capability = { id: 'r:transform', label: 'Transform', contexts: ['field'], source: { repositoryId: 'r', repository: 'owner/name', commit: 'a'.repeat(40), path: 'source.ts', blob: 'b'.repeat(40) } };
const point = { id: 'start', context: ['field'] };
test('context discovery preserves registered order and has no ranking defaults', () => {
  const second = { ...capability, id: 'second' };
  assert.deepEqual(discover([second, capability], point).map(c => c.id), ['second', capability.id]);
  assert.deepEqual(discover([capability], { id: 'other', context: ['dream'] }), []);
});
test('generated adapter requires a runner and preserves source identity', async () => {
  const result = generateAdapter(capability);
  assert.equal(result.contract.connection.state, 'unbound');
  const generated = await import(`data:text/javascript;base64,${Buffer.from(result.module).toString('base64')}`);
  assert.throws(() => generated.connect(), /runner/);
  assert.deepEqual(await generated.connect(async (x: unknown) => x).invoke({ x: 2 }), { x: 2 });
  assert.deepEqual(generated.contract.source, capability.source);
});
test('HTTP connection stays idle until selected and forwards actual output', async () => {
  let calls = 0;
  const events: Transition[] = [];
  const fetcher = (async (_url: unknown, options: RequestInit) => { calls++; assert.equal(JSON.parse(String(options.body)).capabilityId, capability.id); return new Response(JSON.stringify({ real: 'output' })); }) as typeof fetch;
  const binding = connectHttp(capability, 'https://provider.example/transform', fetcher);
  assert.equal(calls, 0);
  const result = await executeSelected(point, capability, binding, { x: 1 }, e => events.push(e), () => 'event-1');
  assert.equal(calls, 1); assert.equal(events.length, 1); assert.equal(result.point.id, 'event-1');
  assert.deepEqual(result.output, { real: 'output' }); assert.deepEqual(events[0].source, capability.source);
});
test('provider failure records failed event and returns to original point', async () => {
  const events: Transition[] = [];
  const binding = connectHttp(capability, 'https://provider.example/', (async () => new Response('failure', { status: 503 })) as typeof fetch);
  await assert.rejects(executeSelected(point, capability, binding, {}, e => events.push(e)), /503/);
  assert.equal(events.length, 1); assert.equal(events[0].outcome, 'failed'); assert.deepEqual(events[0].to, point);
});
test('mismatched connection cannot execute another capability', async () => {
  let called = false;
  await assert.rejects(executeSelected(point, capability, { capabilityId: 'different', transport: 'local', run: async () => { called = true; } }, {}, () => {}), /different capability/);
  assert.equal(called, false);
});
test('connection rejects unsupported schemes and embedded credentials', () => {
  for (const url of ['javascript:alert(1)', 'file:///tmp/data', 'https://user:secret@example.com/']) assert.throws(() => providerUrl(url));
});
test('all observed repositories retain identity, source and resolvable relationships', () => {
  const registry = JSON.parse(readFileSync(new URL('./repository-registry.json', import.meta.url), 'utf8'));
  const rows = registry.repositories;
  assert.equal(rows.length, 34); const ids = new Set(rows.map((r: { id: string }) => r.id)); assert.equal(ids.size, 34);
  for (const row of rows) {
    assert.match(row.commit, /^[a-f0-9]{40}$/); assert.match(row.source.sha, /^[a-f0-9]{40}$/);
    assert.ok(row.source.path); assert.ok(row.runtimeName); assert.ok(row.requirements);
    for (const id of row.relatedRepositoryIds) assert.ok(ids.has(id));
    assert.equal('score' in row, false); assert.equal('verdict' in row, false);
  }
  const mail = rows.find((r: { name: string }) => r.name === 'fuzzyDice-pointWeightList');
  assert.equal(mail.runtimeName, 'globaladdressbook'); assert.ok(mail.aliases.includes('johndoh/roundcube-globaladdressbook'));
  assert.equal(rows.find((r: { name: string }) => r.name === 'DoinBetter-Fractal-Whisper').pending.length, 2);
});

// Known vectors exercise the actual existing-code operation exposed by the adapter.
test('local factorial keeps modular computation and validates its input', async () => {
  const { modularFactorial } = await import('./local-transforms.ts');
  assert.equal(modularFactorial({ n: 0 }).value, 1);
  assert.equal(modularFactorial({ n: 5 }).value, 120);
  assert.equal(modularFactorial({ n: 20 }).value, 146326063);
  for (const n of [-1, 1.2, Infinity, '5', 100001]) assert.throws(() => modularFactorial({ n }));
});
