import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Link2,
  Link2Off,
  LoaderCircle,
  Plus,
  ScanLine,
} from "lucide-react";
import { toast } from "sonner";
import { redirectToLoginIfRequired } from "@/lib/app-data";
import {
  ALPHA,
  FACTOR_144000,
  FOLDER_MAP,
  PLATFORMS,
  SLOTS,
  type Artifact,
  type PlatformId,
  type SlotId,
  type Triage,
  platformById,
  slotById,
} from "@/lib/catalog";
import { scanDrive, scanGmail } from "@/lib/scan";
import { allArtifacts, useArtifacts, useCanon } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { MobiusMark } from "./mobius-mark";
import { DistillView } from "./distill-view";

const TRIAGE_TONE: Record<Triage, "keep" | "archive" | "boundary" | "spec"> = {
  keep: "keep",
  rename: "archive",
  archive: "archive",
  boundary: "boundary",
  spec: "spec",
};

export function BindPage() {
  const view = useCanon((s) => s.view);
  const setView = useCanon((s) => s.setView);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-foreground"
      >
        Skip to work
      </a>
      <Header />
      <nav
        className="mx-auto flex max-w-7xl gap-1 px-4 pt-4 md:px-6"
        aria-label="Views"
      >
        {(
          [
            ["bind", "Bind"],
            ["distill", "Distill"],
            ["map", "Map"],
            ["constants", "Constants"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setView(id)}
            className={cn(
              "h-11 rounded-md px-4 text-sm font-medium transition-colors duration-[var(--motion-quick)]",
              view === id
                ? "bg-subtle text-fg"
                : "text-muted hover:text-fg",
            )}
            aria-current={view === id ? "page" : undefined}
          >
            {label}
          </button>
        ))}
      </nav>
      <main id="work" className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8">
        {view === "bind" ? <BindView /> : null}
        {view === "distill" ? <DistillView /> : null}
        {view === "map" ? <MapView /> : null}
        {view === "constants" ? <ConstantsView /> : null}
      </main>
    </div>
  );
}

function Header() {
  const bindings = useCanon((s) => s.bindings);
  const artifacts = useArtifacts();
  const bound = bindings.length;
  const open = artifacts.length - new Set(bindings.map((b) => b.artifactId)).size;

  function onExport() {
    const payload = {
      generatedAt: new Date().toISOString(),
      alpha: ALPHA,
      factor144000: FACTOR_144000,
      alphaMode: useCanon.getState().alphaMode,
      bindings: useCanon.getState().bindings.map((b) => {
        const art = artifacts.find((a) => a.id === b.artifactId);
        const slot = slotById(b.slotId);
        return {
          artifact: art?.title ?? b.artifactId,
          platform: art?.platformId,
          href: art?.href,
          slot: slot.name,
          path: slot.path,
          triage: slot.triage,
          boundAt: b.boundAt,
        };
      }),
      folders: FOLDER_MAP,
    };
    void navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    toast("Canon map copied.");
  }

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 md:flex-row md:items-end md:justify-between md:px-6 md:py-7">
        <div className="stagger-in flex items-start gap-3">
          <div className="mt-0.5 flex size-11 items-center justify-center rounded-lg bg-subtle text-accent">
            <MobiusMark className="size-7" />
          </div>
          <div>
            <p className="text-xs font-medium tracking-widest text-muted uppercase">
              Möbii³us · DoinBetter
            </p>
            <h1 className="font-display text-3xl leading-tight tracking-tight md:text-4xl">
              Canon Bind
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted">
              Archive snapshot. Platforms on the left, canonical slots on the right.
              Imported statuses are historical. Choose a destination to connect.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-2 font-mono text-xs text-muted tabular-nums">
            {artifacts.length} artifacts · {bound} bound · {open} open
          </p>
          <Button variant="outline" onClick={onExport}>
            Export map
          </Button>
        </div>
      </div>
    </header>
  );
}

function BindView() {
  const selected = useCanon((s) => s.selectedPlatformId);
  const setPlatform = useCanon((s) => s.setPlatform);
  const artifacts = useArtifacts();
  const bindings = useCanon((s) => s.bindings);
  const boundByArtifact = useMemo(() => {
    const m = new Map<string, (typeof bindings)[number]>();
    for (const b of bindings) m.set(b.artifactId, b);
    return m;
  }, [bindings]);
  const boundBySlot = useMemo(() => {
    const m = new Map<SlotId, typeof bindings>();
    for (const b of bindings) {
      const list = m.get(b.slotId) ?? [];
      list.push(b);
      m.set(b.slotId, list);
    }
    return m;
  }, [bindings]);

  const visible = artifacts.filter((a) => a.platformId === selected);
  const platform = platformById(selected);

  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)_18rem] lg:gap-6">
      <PlatformRail
        selected={selected}
        onSelect={setPlatform}
        artifacts={artifacts}
        boundByArtifact={boundByArtifact}
      />
      <section className="min-w-0 rounded-xl bg-elevated p-3 shadow-[var(--shadow-border)] md:p-4">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3 px-1">
          <div>
            <h2 className="font-display text-xl">{platform.name}</h2>
            <p className="text-sm text-muted">
              {platform.owner} · {platform.blurb}
            </p>
          </div>
          <ScanButton platformId={selected} />
        </div>
        {visible.length === 0 ? (
          <EmptyPlatform platformId={selected} />
        ) : (
          <ul className="flex flex-col gap-2">
            {visible.map((a) => (
              <ArtifactRow
                key={a.id}
                artifact={a}
                binding={boundByArtifact.get(a.id)}
              />
            ))}
          </ul>
        )}
        <AddUrl platformId={selected} />
      </section>
      <SlotBoard boundBySlot={boundBySlot} artifacts={artifacts} />
      <BindSheet artifacts={artifacts} />
    </div>
  );
}

function PlatformRail({
  selected,
  onSelect,
  artifacts,
  boundByArtifact,
}: {
  selected: PlatformId;
  onSelect: (id: PlatformId) => void;
  artifacts: Artifact[];
  boundByArtifact: Map<string, { id: string }>;
}) {
  return (
    <aside className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
      <ul className="flex gap-2 lg:flex-col">
        {PLATFORMS.map((p) => {
          const arts = artifacts.filter((a) => a.platformId === p.id);
          const bound = arts.filter((a) => boundByArtifact.has(a.id)).length;
          const active = selected === p.id;
          return (
            <li key={p.id} className="shrink-0 lg:shrink">
              <button
                type="button"
                onClick={() => onSelect(p.id)}
                className={cn(
                  "flex h-auto min-h-11 w-full min-w-44 flex-col items-start rounded-lg px-3 py-2.5 text-left transition-colors duration-[var(--motion-quick)] lg:min-w-0",
                  active ? "bg-elevated text-fg" : "text-muted hover:text-fg",
                )}
                aria-current={active ? "true" : undefined}
              >
                <span className="flex w-full items-center justify-between gap-2">
                  <span className="text-sm font-medium text-fg">{p.name}</span>
                  <Badge
                    tone={
                      p.status === "boundary"
                        ? "boundary"
                        : p.status === "planned"
                          ? "plan"
                          : "live"
                    }
                  >
                    {p.status}
                  </Badge>
                </span>
                <span className="mt-0.5 font-mono text-xs text-muted tabular-nums">
                  {p.owner} · {bound}/{arts.length}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function ArtifactRow({
  artifact,
  binding,
}: {
  artifact: Artifact;
  binding?: { id: string; slotId: SlotId };
}) {
  const openSheet = useCanon((s) => s.openSheet);
  const unbind = useCanon((s) => s.unbind);
  const slot = binding ? slotById(binding.slotId) : null;
  const suggested = artifact.suggestedSlotId
    ? slotById(artifact.suggestedSlotId)
    : null;

  function onConnect() {
    openSheet(artifact.id);
  }

  return (
    <li className="rounded-lg bg-subtle p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-medium">{artifact.title}</p>
            <Badge tone={artifact.origin === "live" ? "live" : "plan"}>
              {artifact.origin}
            </Badge>
            <Badge tone="mute">{artifact.kind}</Badge>
          </div>
          <p className="mt-0.5 text-sm text-muted">{artifact.subtitle}</p>
          {slot ? (
            <p className="mt-1 font-mono text-xs text-keep">
              Bound · {slot.path}
            </p>
          ) : suggested ? (
            <p className="mt-1 font-mono text-xs text-muted">
              Archived hint: {suggested.path}
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted">Choose a destination.</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {artifact.href ? (
            <Button variant="ghost" size="icon" asChild>
              <a
                href={artifact.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${artifact.title}`}
              >
                <ArrowUpRight />
              </a>
            </Button>
          ) : null}
          {binding ? (
            <Button
              variant="outline"
              onClick={() => {
                unbind(binding.id);
                toast("Unbound.");
              }}
            >
              <Link2Off />
              Unbind
            </Button>
          ) : (
            <Button onClick={onConnect}>
              <Link2 />
              Connect
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

function SlotBoard({
  boundBySlot,
  artifacts,
}: {
  boundBySlot: Map<SlotId, Array<{ id: string; artifactId: string }>>;
  artifacts: Artifact[];
}) {
  return (
    <section className="rounded-xl bg-elevated p-3 shadow-[var(--shadow-border)] md:p-4">
      <h2 className="font-display text-xl">Canonical slots</h2>
      <p className="mb-3 text-sm text-muted">
        Keep, archive, or hold the Michael boundary.
      </p>
      <ul className="flex flex-col gap-2">
        {SLOTS.map((slot) => {
          const links = boundBySlot.get(slot.id) ?? [];
          const conflict = links.length > 1 && slot.id === "cat-labs-mark";
          return (
            <li key={slot.id} className="rounded-lg bg-subtle px-3 py-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{slot.name}</p>
                  <p className="font-mono text-xs text-muted">{slot.path}</p>
                </div>
                <Badge tone={conflict ? "archive" : TRIAGE_TONE[slot.triage]}>
                  {conflict ? "conflict" : slot.triage}
                </Badge>
              </div>
              {links.length === 0 ? (
                <p className="mt-1 text-xs text-muted">Open</p>
              ) : (
                <ul className="mt-1 space-y-0.5">
                  {links.map((b) => {
                    const art = artifacts.find((a) => a.id === b.artifactId);
                    return (
                      <li
                        key={b.id}
                        className="truncate text-xs text-fg"
                      >
                        {art?.title ?? b.artifactId}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function BindSheet({ artifacts }: { artifacts: Artifact[] }) {
  const sheetArtifactId = useCanon((s) => s.sheetArtifactId);
  const openSheet = useCanon((s) => s.openSheet);
  const bind = useCanon((s) => s.bind);
  const artifact = artifacts.find((a) => a.id === sheetArtifactId) ?? null;
  const [pick, setPick] = useState<SlotId | null>(null);

  const selected = pick;

  return (
    <Sheet
      open={Boolean(artifact)}
      onOpenChange={(open) => {
        if (!open) {
          openSheet(null);
          setPick(null);
        }
      }}
    >
      <SheetContent>
        {artifact ? (
          <>
            <SheetTitle>Connect</SheetTitle>
            <SheetDescription>
              Choose a destination for {artifact.title}, then confirm the link.
            </SheetDescription>
            <ul className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
              {SLOTS.map((slot) => {
                const active = selected === slot.id;
                const suggested = artifact.suggestedSlotId === slot.id;
                return (
                  <li key={slot.id}>
                    <button
                      type="button"
                      onClick={() => setPick(slot.id)}
                      className={cn(
                        "flex min-h-11 w-full flex-col items-start rounded-lg px-3 py-2.5 text-left transition-colors duration-[var(--motion-quick)]",
                        active ? "bg-subtle text-fg" : "text-muted hover:text-fg",
                      )}
                    >
                      <span className="flex w-full items-center justify-between gap-2">
                        <span className="text-sm font-medium text-fg">
                          {slot.name}
                        </span>
                        <span className="flex gap-1">
                          {suggested ? <Badge tone="mute">archived hint</Badge> : null}
                          <Badge tone={TRIAGE_TONE[slot.triage]}>
                            {slot.triage}
                          </Badge>
                        </span>
                      </span>
                      <span className="font-mono text-xs">{slot.path}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex gap-2">
              <Button
                className="flex-1"
                disabled={selected === null}
                onClick={() => {
                  if (selected === null) return;
                  bind(artifact.id, selected);
                  toast(`Bound to ${slotById(selected).name}.`);
                  setPick(null);
                }}
              >
                <Link2 />
                Connect
              </Button>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function ScanButton({ platformId }: { platformId: PlatformId }) {
  const platform = platformById(platformId);
  const mergeLive = useCanon((s) => s.mergeLive);
  const [busy, setBusy] = useState(false);
  if (!platform.liveScan) return null;

  async function run() {
    setBusy(true);
    try {
      const result =
        platform.liveScan === "drive"
          ? await scanDrive({ data: {} })
          : await scanGmail({ data: {} });
      if (result.loginRequired) {
        redirectToLoginIfRequired({
          ok: false,
          data: null,
          loginRequired: true,
          loginUrl: result.loginUrl,
        });
        return;
      }
      if (!result.ok) {
        toast(result.error ?? "Scan failed.");
        return;
      }
      mergeLive(result.artifacts);
      toast(
        result.artifacts.length
          ? `Pulled ${result.artifacts.length} from ${platform.name}.`
          : `No new ${platform.name} artifacts.`,
      );
    } catch (err) {
      toast(err instanceof Error ? err.message : "Scan failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button variant="outline" onClick={() => void run()} disabled={busy}>
      {busy ? <LoaderCircle className="animate-spin" /> : <ScanLine />}
      Scan
    </Button>
  );
}

function EmptyPlatform({ platformId }: { platformId: PlatformId }) {
  const p = platformById(platformId);
  return (
    <div className="rounded-lg bg-subtle px-4 py-8 text-center">
      <p className="text-sm text-fg">Nothing on {p.name} yet.</p>
      <p className="mt-1 text-sm text-muted">
        Paste a URL below, or scan if this platform supports it.
      </p>
    </div>
  );
}

function AddUrl({ platformId }: { platformId: PlatformId }) {
  const addCustom = useCanon((s) => s.addCustom);
  const openSheet = useCanon((s) => s.openSheet);
  const [title, setTitle] = useState("");
  const [href, setHref] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const name = title.trim() || href.trim();
    if (!name) return;
    const id = `custom-${Date.now()}`;
    addCustom({
      id,
      platformId,
      title: name,
      subtitle: href.trim() || "Added here",
      href: href.trim() || undefined,
      kind: "url",
      suggestedSlotId: "incoming",
      confidence: "low",
      origin: "live",
    });
    setTitle("");
    setHref("");
    openSheet(id);
    toast("Artifact added. Pick a slot.");
  }

  return (
    <form
      onSubmit={submit}
      className="mt-4 grid grid-cols-1 gap-2 rounded-lg bg-subtle p-3 md:grid-cols-3"
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Name"
        aria-label="Artifact name"
      />
      <Input
        value={href}
        onChange={(e) => setHref(e.target.value)}
        placeholder="https://"
        inputMode="url"
        aria-label="Artifact URL"
      />
      <Button type="submit" variant="outline" className="w-full md:w-auto">
        <Plus />
        Add
      </Button>
    </form>
  );
}

function MapView() {
  const bindings = useCanon((s) => s.bindings);
  const artifacts = useArtifacts();

  return (
    <section className="rounded-xl bg-elevated p-4 shadow-[var(--shadow-border)] md:p-6">
      <h2 className="font-display text-2xl">Target folder structure</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Canonical layout for overlapping Dropbox zips. Bind first, then keep,
        rename, archive, or hold at the Michael boundary.
      </p>
      <ol className="mt-6 space-y-3">
        {FOLDER_MAP.map((node) => {
          const slot = SLOTS.find((s) => s.path === node.path);
          const links = slot
            ? bindings.filter((b) => b.slotId === slot.id)
            : [];
          return (
            <li
              key={node.path}
              className="rounded-lg bg-subtle px-4 py-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-sm text-fg">{node.path}</p>
                  <p className="text-sm font-medium">{node.label}</p>
                  <p className="text-sm text-muted">{node.note}</p>
                </div>
                <Badge tone={TRIAGE_TONE[node.triage]}>{node.triage}</Badge>
              </div>
              {links.length ? (
                <ul className="mt-2 space-y-1">
                  {links.map((b) => {
                    const art = artifacts.find((a) => a.id === b.artifactId);
                    return (
                      <li key={b.id} className="text-sm text-fg">
                        {art?.title}{" "}
                        <span className="text-muted">
                          · {art ? platformById(art.platformId).name : ""}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-muted">No bindings yet.</p>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function ConstantsView() {
  const alphaMode = useCanon((s) => s.alphaMode);
  const setAlphaMode = useCanon((s) => s.setAlphaMode);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-xl bg-elevated p-5 shadow-[var(--shadow-border)]">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">
          Factorization
        </p>
        <h2 className="mt-2 font-display text-3xl">144,000</h2>
        <p className="mt-3 font-mono text-lg text-accent">{FACTOR_144000}</p>
        <p className="mt-3 text-sm text-muted">
          Corrected factorization. Use this form everywhere the number is
          expanded.
        </p>
      </section>
      <section className="rounded-xl bg-elevated p-5 shadow-[var(--shadow-border)]">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">
          Coupling
        </p>
        <h2 className="mt-2 font-display text-3xl">
          α = {ALPHA}
        </h2>
        <p className="mt-3 text-sm text-muted">
          Shared until you split it into named per-layer constants.
        </p>
        <div className="mt-4 flex gap-2">
          <Button
            variant={alphaMode === "shared" ? "default" : "outline"}
            onClick={() => setAlphaMode("shared")}
          >
            Keep shared
          </Button>
          <Button
            variant={alphaMode === "split" ? "default" : "outline"}
            onClick={() => setAlphaMode("split")}
          >
            Split later
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted">
          {alphaMode === "shared"
            ? "One α across layers. Decision recorded here."
            : "Flagged to split. Named constants are not defined yet."}
        </p>
      </section>
      <section className="rounded-xl bg-elevated p-5 shadow-[var(--shadow-border)] md:col-span-2">
        <h2 className="font-display text-xl">Ownership line</h2>
        <Separator className="my-3" />
        <dl className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <dt className="text-muted">Yours</dt>
            <dd>git4emet · DoinBetter · Cat Labs · heyMico</dd>
          </div>
          <div>
            <dt className="text-muted">Michael</dt>
            <dd>kaizencycle/Mobius-Substrate and sibling repos. Boundary.</dd>
          </div>
          <div>
            <dt className="text-muted">Voice</dt>
            <dd>mom-voice-buddy stays unbound until keys are server-only.</dd>
          </div>
          <div>
            <dt className="text-muted">Connectus</dt>
            <dd>Spec slot. UZFL + hypergraphs + the live-feedback pitch. No repo yet.</dd>
          </div>
          <div>
            <dt className="text-muted">CatGPT</dt>
            <dd>Physical Phones / askcatgpt.com. Separate from Möbii³us source.</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
