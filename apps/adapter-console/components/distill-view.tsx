import { useMemo } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import { toast } from "sonner";
import {
  ASSESSED_AT,
  DROPS,
  HYPERGRAPHS,
  MICHAEL_REPOS,
  OPT_ACTIONS,
  YOURS_REPOS,
  actionTriage,
  assessmentCsv,
  assessmentJson,
  formatSize,
  type AssessedRepo,
  type OptAction,
} from "@/lib/assessment";
import { slotById, type SlotId, type Triage } from "@/lib/catalog";
import { useArtifacts, useCanon } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TRIAGE_TONE: Record<Triage, "keep" | "archive" | "boundary" | "spec"> = {
  keep: "keep",
  rename: "archive",
  archive: "archive",
  boundary: "boundary",
  spec: "spec",
};

function download(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function DistillView() {
  const artifacts = useArtifacts();
  const bindings = useCanon((s) => s.bindings);
  const bind = useCanon((s) => s.bind);
  const bindMany = useCanon((s) => s.bindMany);
  const boundIds = useMemo(
    () => new Set(bindings.map((b) => b.artifactId)),
    [bindings],
  );

  function suggestedSlot(artifactId: string, fallback: SlotId | null): SlotId | null {
    const art = artifacts.find((a) => a.id === artifactId);
    return art?.suggestedSlotId ?? fallback;
  }

  function applyAction(action: OptAction) {
    const pairs = action.artifactIds.flatMap((id) => {
      const slot = action.slotId;
      return slot ? [{ artifactId: id, slotId: slot }] : [];
    });
    const n = bindMany(pairs);
    if (n === 0) toast("Nothing to bind on this row.");
    else toast(`Bound ${n} ${n === 1 ? "link" : "links"} · ${action.title}`);
  }

  function onExportJson() {
    download(
      "canon-github-assessment.json",
      JSON.stringify(assessmentJson(boundIds), null, 2),
      "application/json",
    );
    toast("Assessment JSON downloaded.");
  }

  function onExportCsv() {
    download("canon-github-repos.csv", assessmentCsv(), "text/csv");
    toast("Repo spreadsheet downloaded.");
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-xl bg-elevated p-4 shadow-[var(--shadow-border)] md:p-6">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">
          Historical assessment · {ASSESSED_AT}
        </p>
        <h2 className="mt-2 font-display text-2xl md:text-3xl">
          Optimization distillation
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Live pull of git4emet and kaizencycle. Push Connect on a row to bind
          it into canon. Spreadsheet and JSON export are the working copies.
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Your originals" value="9" />
          <Stat label="Forks to park" value="17" />
          <Stat label="Michael" value="18" />
          <Stat label="Clone dumps" value="3" warn />
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" onClick={onExportCsv}>
            <Download />
            Spreadsheet
          </Button>
          <Button variant="outline" onClick={onExportJson}>
            <Download />
            JSON
          </Button>
        </div>
      </section>

      <section>
        <h3 className="font-display text-xl">Do these first</h3>
        <ul className="mt-3 flex flex-col gap-2">
          {OPT_ACTIONS.map((action) => {
            const done = action.artifactIds.every((id) => boundIds.has(id));
            return (
              <li
                key={action.id}
                className="rounded-xl bg-elevated p-4 shadow-[var(--shadow-border)]"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{action.title}</p>
                      <Badge
                        tone={
                          action.severity === "high" ? "boundary" : "archive"
                        }
                      >
                        {action.severity}
                      </Badge>
                      {done ? <Badge tone="keep">bound</Badge> : null}
                    </div>
                    <p className="mt-1 text-sm text-muted">{action.detail}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={done ? "outline" : "default"}
                    className="shrink-0"
                    onClick={() => applyAction(action)}
                  >
                    {done ? "Rebind" : action.connectLabel}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <RepoTable
        title="git4emet — yours"
        repos={YOURS_REPOS}
        boundIds={boundIds}
        onBind={(repo) => {
          if (!repo.artifactId || !repo.slotId) {
            toast("No bind target for that repo.");
            return;
          }
          bind(repo.artifactId, repo.slotId);
          toast(`Bound ${repo.fullName}.`);
        }}
      />

      <RepoTable
        title="kaizencycle — Michael, pull only"
        repos={MICHAEL_REPOS}
        boundIds={boundIds}
        onBind={(repo) => {
          if (!repo.artifactId || !repo.slotId) return;
          bind(repo.artifactId, repo.slotId);
          toast(`Bound at boundary · ${repo.fullName}.`);
        }}
      />

      <section>
        <h3 className="font-display text-xl">This drop</h3>
        <p className="mt-1 text-sm text-muted">
          Classified from the files you just handed over. Phone numbers and
          raw address lists stay off this page.
        </p>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {DROPS.map((drop) => {
            const slot = slotById(drop.slotId);
            const done = boundIds.has(drop.artifactId);
            return (
              <li
                key={drop.artifactId}
                className="flex gap-3 rounded-xl bg-elevated p-3 shadow-[var(--shadow-border)]"
              >
                {drop.image ? (
                  <img
                    src={drop.image}
                    alt=""
                    className="size-16 shrink-0 rounded-md object-cover bg-subtle"
                  />
                ) : (
                  <div className="size-16 shrink-0 rounded-md bg-subtle" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{drop.title}</p>
                    <Badge tone={TRIAGE_TONE[slot.triage]}>{slot.triage}</Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-muted">{drop.what}</p>
                  <p className="mt-1 font-mono text-xs text-muted">{slot.path}</p>
                  <Button
                    size="sm"
                    variant={done ? "outline" : "default"}
                    className="mt-2"
                    onClick={() => {
                      bind(drop.artifactId, drop.slotId);
                      toast(`Bound to ${slot.name}.`);
                    }}
                  >
                    {done ? "Bound" : "Connect"}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-xl bg-elevated p-4 shadow-[var(--shadow-border)] md:p-6">
        <h3 className="font-display text-xl">Hypergraph lanes</h3>
        <p className="mt-1 text-sm text-muted">
          From the federation zip. Spec nodes only — nothing here is a repo
          to clone.
        </p>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {HYPERGRAPHS.map((hg) => (
            <li
              key={hg.id}
              className="flex items-baseline justify-between gap-2 rounded-lg bg-subtle px-3 py-2"
            >
              <span className="font-mono text-xs text-muted">{hg.id}</span>
              <span className="flex-1 text-sm">{hg.name}</span>
              <span className="text-xs text-muted">{hg.lane}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className="rounded-lg bg-subtle px-3 py-3">
      <dt className="text-xs tracking-wide text-muted uppercase">{label}</dt>
      <dd
        className={cn(
          "mt-1 font-mono text-lg whitespace-nowrap tabular-nums",
          warn ? "text-warn" : "text-fg",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function RepoTable({
  title,
  repos,
  boundIds,
  onBind,
}: {
  title: string;
  repos: AssessedRepo[];
  boundIds: Set<string>;
  onBind: (repo: AssessedRepo) => void;
}) {
  return (
    <section className="rounded-xl bg-elevated p-4 shadow-[var(--shadow-border)] md:p-6">
      <h3 className="font-display text-xl">{title}</h3>
      <div className="mt-3 -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs tracking-wide text-muted uppercase">
              <th className="py-2 pr-3 font-medium">Repo</th>
              <th className="py-2 pr-3 font-medium">Action</th>
              <th className="py-2 pr-3 font-medium">Size</th>
              <th className="py-2 pr-3 font-medium">Pushed</th>
              <th className="py-2 font-medium">Bind</th>
            </tr>
          </thead>
          <tbody>
            {repos.map((repo) => {
              const done = repo.artifactId
                ? boundIds.has(repo.artifactId)
                : false;
              return (
                <tr
                  key={repo.fullName}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-3 pr-3 align-top">
                    <a
                      href={repo.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-medium hover:text-accent"
                    >
                      {repo.fullName.replace(/^[^/]+\//, "")}
                      <ArrowUpRight className="size-3.5 text-muted" />
                    </a>
                    <p className="mt-0.5 text-xs text-muted">{repo.note}</p>
                  </td>
                  <td className="py-3 pr-3 align-top">
                    <Badge tone={TRIAGE_TONE[actionTriage(repo.action)]}>
                      {repo.action}
                    </Badge>
                  </td>
                  <td className="py-3 pr-3 align-top font-mono text-xs tabular-nums">
                    {formatSize(repo.sizeKb)}
                    {repo.visibility === "private" ? " · priv" : ""}
                    {repo.fork ? " · fork" : ""}
                  </td>
                  <td className="py-3 pr-3 align-top font-mono text-xs tabular-nums text-muted">
                    {repo.pushed}
                  </td>
                  <td className="py-3 align-top">
                    {repo.artifactId ? (
                      <Button
                        size="sm"
                        variant={done ? "outline" : "default"}
                        onClick={() => onBind(repo)}
                      >
                        {done ? "Bound" : "Connect"}
                      </Button>
                    ) : (
                      <span className="text-xs text-muted">leave</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
