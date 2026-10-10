import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Download, Link2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { repositories, observedAt, findRepositories, sourceUrl, capabilityFor } from '@/lib/repositories';
import { connectHttp, executeSelected, generateAdapter, type Point, type Transition } from '@/lib/capability-adapter';

import { connectLocal } from '@/lib/local-transforms';

const HISTORY_KEY = 'mobiius.adapter.transitions.v1';
function download(name: string, value: string, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([value], { type }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function CapabilityPage() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('1412748309');
  const selected = repositories.find(r => r.id === selectedId) ?? repositories[0];
  const [point, setPoint] = useState<Point>({ id: 'home', context: ['adapter'] });
  const [endpoint, setEndpoint] = useState('');
  const [connection, setConnection] = useState<ReturnType<typeof connectHttp> | null>(null);
  const [input, setInput] = useState('{}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<Transition[]>([]);
  const [ready, setReady] = useState(false);
  const visible = useMemo(() => findRepositories(query), [query]);
  const capability = capabilityFor(selected);
  const local = connectLocal(capability);
  useEffect(() => {
    try {
      const raw: unknown = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
      if (Array.isArray(raw) && raw.every(e => e && typeof e.id === 'string' && e.source && typeof e.source.repository === 'string' && e.script && e.to && e.from)) setHistory(raw);
    } catch { setError('Saved history could not be read. Export new transitions before leaving.'); }
    setReady(true);
  }, []);
  function record(event: Transition) {
    setHistory(previous => [...previous, event]);
  }
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); }
    catch { setError('Browser storage is unavailable. Export the transition history to retain it.'); }
  }, [history, ready]);
  function choose(id: string) {
    const repo = repositories.find(r => r.id === id)!;
    setSelectedId(id); setPoint({ id: repo.id, context: [repo.facet] });
    setConnection(null); setEndpoint(''); setInput(repo.id === '1291654265' ? '{"n":5}' : '{}'); setOutput(''); setError('');
  }
  async function invoke(selectedBinding = connection) {
    if (!selectedBinding) return;
    setBusy(true); setError('');
    try {
      const result = await executeSelected(point, capability, selectedBinding, JSON.parse(input), record);
      setPoint(result.point); setOutput(JSON.stringify(result.output, null, 2));
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(false); }
  }
  async function prepare() {
    setError('');
    const result = await executeSelected(point, capability, { capabilityId: capability.id, transport: 'local', run: async () => generateAdapter(capability) }, undefined, record);
    setPoint(result.point);
    const generated = result.output as ReturnType<typeof generateAdapter>;
    setOutput(JSON.stringify(generated.contract, null, 2));
    download(`${selected.name}.adapter.mjs`, generated.module, 'text/javascript');
  }
  return <div className="min-h-dvh bg-bg text-fg">
    <header className="border-b border-border"><div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4 py-6 md:px-6">
      <div><p className="text-xs tracking-widest text-muted uppercase">Möbii³us · DoinBetter</p><h1 className="font-display text-4xl">Available avenues</h1><p className="mt-2 max-w-xl text-sm text-muted">Find a repository by its new name, original code name, or capability. Select where to go from your current point.</p></div>
      <Button variant="outline" onClick={() => download('mobiius-workspace.json', JSON.stringify({ observedAt, repositories, transitions: history }, null, 2))}><Download className="size-4" /> Export workspace</Button>
    </div></header>
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:px-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <aside className="min-w-0"><label htmlFor="repository-search" className="mb-2 flex items-center gap-2 text-sm"><Search className="size-4" /> Names and capabilities</label><Input id="repository-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Name, upstream, or implemented function" />
        <p className="my-3 text-xs text-muted">{visible.length} repositories · observed {observedAt}</p>
        <div className="space-y-2">{visible.map(repo => <button type="button" key={repo.id} onClick={() => choose(repo.id)} aria-pressed={repo.id === selected.id} className={`w-full rounded-lg border p-3 text-left ${repo.id === selected.id ? 'border-accent bg-subtle' : 'border-border bg-elevated hover:bg-subtle'}`}><span className="block break-words text-sm font-medium">{repo.name}</span><span className="mt-1 block text-xs text-muted">{repo.implemented}</span></button>)}{visible.length === 0 && <p className="py-8 text-sm text-muted">No matching repository. Try an original package name or another capability.</p>}</div>
      </aside>
      <section className="min-w-0 space-y-6" aria-label="Selected capability">
        <div className="rounded-xl border border-border bg-elevated p-5"><p className="text-xs uppercase tracking-widest text-muted">Current point · {selected.facet}</p><h2 className="mt-2 break-words font-display text-3xl">{selected.name}</h2><p className="mt-2 text-muted">{selected.role}</p><dl className="mt-5 space-y-4 text-sm"><div><dt className="font-medium">Implemented as</dt><dd className="mt-1 text-muted">{selected.implemented}</dd></div><div><dt className="font-medium">Runtime identifier</dt><dd className="mt-1 break-words font-mono text-muted">{selected.runtimeName}</dd></div><div><dt className="font-medium">Activation requirements</dt><dd className="mt-1 text-muted">{selected.requirements}</dd></div></dl>
          <div className="mt-5 flex flex-wrap gap-3"><a className="flex min-h-11 items-center gap-2 text-sm underline" href={sourceUrl(selected)} target="_blank" rel="noreferrer">Inspect source <ArrowUpRight className="size-4" /></a>{selected.upstream && <a className="flex min-h-11 items-center gap-2 text-sm underline" href={`https://github.com/${selected.upstream}`} target="_blank" rel="noreferrer">Original builder <ArrowUpRight className="size-4" /></a>}</div>
          <p className="mt-3 break-all font-mono text-xs text-muted">Repository ID {selected.id} · {selected.commit}</p>
        </div>
        <div className="rounded-xl border border-border p-5"><h3 className="font-display text-2xl">Select a transition</h3><p className="mt-2 text-sm text-muted">Generate a local interface or connect a provider you already have. The module carries the source identity and accepts an executable runner.</p><div className="my-4"><Button onClick={() => void prepare()} disabled={busy || !ready}><Download className="size-4" /> Generate adapter</Button></div>
          <label htmlFor="provider-url" className="text-sm">Existing provider endpoint</label><div className="mt-2 flex flex-col gap-2 sm:flex-row"><Input id="provider-url" type="url" placeholder="https://provider.example/transform" value={endpoint} onChange={e => { setEndpoint(e.target.value); setConnection(null); }} /><Button variant="outline" disabled={busy} onClick={() => { try { setConnection(connectHttp(capability, endpoint)); setError(''); } catch(e) { setError(e instanceof Error ? e.message : String(e)); } }}><Link2 className="size-4" /> Connect</Button></div>
          {connection && <p className="mt-2 text-xs text-muted">Endpoint configured. The selected transform will contact it; reachability has not yet been checked.</p>}
          <label htmlFor="transform-input" className="mt-4 block text-sm">Transform input (JSON)</label><textarea id="transform-input" rows={4} className="mt-2 w-full rounded-md border border-border bg-subtle p-3 font-mono text-sm" value={input} onChange={e => setInput(e.target.value)} />
          {local && <Button className="mt-3 mr-2" disabled={busy || !ready} onClick={() => void invoke(local)}>Run existing local transform</Button>}
          <Button className="mt-3" disabled={!connection || busy || !ready} onClick={() => void invoke()}>{busy ? 'Executing…' : 'Execute selected transform'}</Button>
          {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}{output && <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-subtle p-4 text-xs">{output}</pre>}
        </div>
        <div className="rounded-xl border border-border p-5"><h3 className="font-display text-2xl">Connected sources</h3><p className="mt-2 text-sm text-muted">These are source relationships. Select one to inspect its own implementation and connection requirements.</p><div className="mt-4 flex flex-wrap gap-2">{selected.relatedRepositoryIds.map(id => { const r = repositories.find(x => x.id === id)!; return <Button variant="outline" key={id} onClick={() => choose(id)} className="h-auto min-h-11 max-w-full whitespace-normal break-words text-left">{r.name}</Button>; })}</div>{selected.relatedRepositoryIds.length === 0 && <p className="mt-3 text-sm text-muted">No cross-repository binding has been recorded for this source.</p>}
          {selected.pending.length > 0 && <div className="mt-5"><h4 className="text-sm font-medium">Code on open pull requests</h4>{selected.pending.map(pr => <a key={pr.number} href={pr.url} target="_blank" rel="noreferrer" className="mt-3 block break-words text-sm underline">PR #{pr.number}: {pr.description}</a>)}</div>}
        </div>
        <div className="rounded-xl border border-border p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-display text-2xl">Event + script</h3><Button variant="outline" onClick={() => download('mobiius-transitions.json', JSON.stringify(history, null, 2))}>Export history</Button></div><p className="mt-2 break-all font-mono text-xs text-muted">Point {point.id} · {history.length} recorded transitions · browser-local storage</p><ol className="mt-4 space-y-2">{history.slice(-8).reverse().map(event => <li key={event.id} className="break-words rounded-md bg-subtle p-3 text-xs">{event.outcome} · {event.source.repository} · {event.transport}<br /><span className="text-muted">{event.timestamp} · {event.script.capabilityId}</span></li>)}</ol>{history.length === 0 && <p className="mt-4 text-sm text-muted">Select a transform to start a transition history.</p>}</div>
      </section>
    </main>
  </div>;
}
