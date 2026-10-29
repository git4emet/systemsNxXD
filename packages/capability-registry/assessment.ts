import type { SlotId, Triage } from "./catalog";

export type RepoAction = "keep" | "archive" | "boundary" | "shell" | "triage";

export type AssessedRepo = {
  fullName: string;
  href: string;
  owner: "yours" | "michael";
  language: string;
  sizeKb: number;
  pushed: string;
  visibility: "public" | "private";
  fork: boolean;
  issues: number;
  action: RepoAction;
  note: string;
  artifactId?: string;
  slotId?: SlotId;
};

export type OptAction = {
  id: string;
  title: string;
  detail: string;
  severity: "high" | "medium" | "low";
  slotId: SlotId | null;
  artifactIds: string[];
  connectLabel: string;
};

export type DropClass = {
  artifactId: string;
  title: string;
  what: string;
  slotId: SlotId;
  image?: string;
};

export const ASSESSED_AT = "2026-09-23";

export const VERDICT = {
  yoursVisible: 26,
  yoursOriginals: 9,
  yoursForks: 17,
  michael: 18,
  dumpsMb: 122 + 122 + 44,
  shells: 3,
  envLeak: true,
} as const;

export const YOURS_REPOS: AssessedRepo[] = [
  {
    fullName: "git4emet/mobiius-ops-console",
    href: "https://github.com/git4emet/mobiius-ops-console",
    owner: "yours",
    language: "TypeScript",
    sizeKb: 352,
    pushed: "2026-08-31",
    visibility: "private",
    fork: false,
    issues: 1,
    action: "keep",
    note: "Only real Möbii³us source on this account. .env is in the tree — rotate.",
    artifactId: "gh-ops",
    slotId: "mobiius-source",
  },
  {
    fullName: "git4emet/DoinBetter-Floodwater",
    href: "https://github.com/git4emet/DoinBetter-Floodwater",
    owner: "yours",
    language: "none",
    sizeKb: 19,
    pushed: "2026-08-31",
    visibility: "public",
    fork: false,
    issues: 1,
    action: "shell",
    note: "README + docs/ + skills.md. Keep the name; do not treat as source.",
    artifactId: "gh-flood",
    slotId: "doinbetter-floodwater",
  },
  {
    fullName: "git4emet/DoinBetter-Fractal-Whisper",
    href: "https://github.com/git4emet/DoinBetter-Fractal-Whisper",
    owner: "yours",
    language: "none",
    sizeKb: 33,
    pushed: "2026-08-31",
    visibility: "public",
    fork: false,
    issues: 10,
    action: "shell",
    note: "Issue tracker is the product. No language, no src.",
    artifactId: "gh-whisper",
    slotId: "doinbetter-whisper",
  },
  {
    fullName: "git4emet/DoinBetter-ALTA-Survey",
    href: "https://github.com/git4emet/DoinBetter-ALTA-Survey",
    owner: "yours",
    language: "none",
    sizeKb: 12,
    pushed: "2026-08-31",
    visibility: "public",
    fork: false,
    issues: 1,
    action: "shell",
    note: "Same shell pattern as Floodwater.",
    artifactId: "gh-alta",
    slotId: "doinbetter-alta",
  },
  {
    fullName: "git4emet/nextjs-boilerplate",
    href: "https://github.com/git4emet/nextjs-boilerplate",
    owner: "yours",
    language: "TypeScript",
    sizeKb: 64,
    pushed: "2026-06-24",
    visibility: "private",
    fork: false,
    issues: 0,
    action: "keep",
    note: "Linked Vercel surface. Template, not canon.",
    artifactId: "gh-next",
    slotId: "deploy-surface",
  },
  {
    fullName: "git4emet/git4emet",
    href: "https://github.com/git4emet/git4emet",
    owner: "yours",
    language: "JavaScript",
    sizeKb: 2089,
    pushed: "2026-08-31",
    visibility: "private",
    fork: false,
    issues: 1,
    action: "triage",
    note: "Profile repo. Leave it; do not bind as product.",
  },
  {
    fullName: "git4emet/silver-bold-wood-scarlet",
    href: "https://github.com/git4emet/silver-bold-wood-scarlet",
    owner: "yours",
    language: "JavaScript",
    sizeKb: 124889,
    pushed: "2026-09-15",
    visibility: "public",
    fork: false,
    issues: 0,
    action: "archive",
    note: "Grok App Builder dump. Same file list as civic-moonflowers.",
    artifactId: "gh-scarlet",
    slotId: "archive-dumps",
  },
  {
    fullName: "git4emet/civic-moonflowers",
    href: "https://github.com/git4emet/civic-moonflowers",
    owner: "yours",
    language: "JavaScript",
    sizeKb: 124889,
    pushed: "2026-09-14",
    visibility: "public",
    fork: false,
    issues: 0,
    action: "archive",
    note: "Twin of scarlet. Public 122 MB of sandbox, not product.",
    artifactId: "gh-moon",
    slotId: "archive-dumps",
  },
  {
    fullName: "git4emet/FindYourBase",
    href: "https://github.com/git4emet/FindYourBase",
    owner: "yours",
    language: "Python",
    sizeKb: 44717,
    pushed: "2026-09-13",
    visibility: "public",
    fork: false,
    issues: 0,
    action: "archive",
    note: "Same AGENTS.md / startup.sh scaffold. Language label is a misdetect.",
    artifactId: "gh-findbase",
    slotId: "archive-dumps",
  },
  {
    fullName: "git4emet/* (17 forks)",
    href: "https://github.com/git4emet?tab=repositories&type=fork",
    owner: "yours",
    language: "mixed",
    sizeKb: 0,
    pushed: "2026-07-07",
    visibility: "public",
    fork: true,
    issues: 0,
    action: "archive",
    note: "One-day fork swarm (roundcube, WebGPU, skillcoin, ContactResumes…). Experiments.",
    artifactId: "gh-fork-swarm",
    slotId: "archive-dumps",
  },
];

export const MICHAEL_REPOS: AssessedRepo[] = [
  {
    fullName: "kaizencycle/Mobius-Substrate",
    href: "https://github.com/kaizencycle/Mobius-Substrate",
    owner: "michael",
    language: "TypeScript",
    sizeKb: 25867,
    pushed: "2026-09-23",
    visibility: "public",
    fork: false,
    issues: 7,
    action: "boundary",
    note: "His source of truth. You have pull, not push.",
    artifactId: "mk-substrate",
    slotId: "michael-boundary",
  },
  {
    fullName: "kaizencycle/mobius-civic-ai-terminal",
    href: "https://github.com/kaizencycle/mobius-civic-ai-terminal",
    owner: "michael",
    language: "TypeScript",
    sizeKb: 13953,
    pushed: "2026-09-23",
    visibility: "public",
    fork: false,
    issues: 0,
    action: "boundary",
    note: "Live today. Cite, do not fork-overwrite.",
    artifactId: "mk-terminal",
    slotId: "michael-boundary",
  },
  {
    fullName: "kaizencycle/mobius-browser-shell",
    href: "https://github.com/kaizencycle/mobius-browser-shell",
    owner: "michael",
    language: "TypeScript",
    sizeKb: 5978,
    pushed: "2026-09-23",
    visibility: "public",
    fork: false,
    issues: 0,
    action: "boundary",
    note: "Chambers UI. Boundary.",
    artifactId: "mk-shell",
    slotId: "michael-boundary",
  },
  {
    fullName: "kaizencycle/mobius-hive",
    href: "https://github.com/kaizencycle/mobius-hive",
    owner: "michael",
    language: "JavaScript",
    sizeKb: 5574,
    pushed: "2026-09-23",
    visibility: "public",
    fork: false,
    issues: 0,
    action: "boundary",
    note: "New since last catalog. Still his.",
    artifactId: "mk-hive",
    slotId: "michael-boundary",
  },
  {
    fullName: "kaizencycle/Civic-Protocol-Core",
    href: "https://github.com/kaizencycle/Civic-Protocol-Core",
    owner: "michael",
    language: "Python",
    sizeKb: 1364,
    pushed: "2026-09-23",
    visibility: "public",
    fork: false,
    issues: 0,
    action: "boundary",
    note: "Pushed today. Boundary.",
    artifactId: "mk-civic-core",
    slotId: "michael-boundary",
  },
  {
    fullName: "kaizencycle/epicon",
    href: "https://github.com/kaizencycle/epicon",
    owner: "michael",
    language: "JavaScript",
    sizeKb: 531,
    pushed: "2026-08-03",
    visibility: "public",
    fork: false,
    issues: 0,
    action: "boundary",
    note: "No consequential action without recorded intent.",
    artifactId: "mk-epicon",
    slotId: "michael-boundary",
  },
];

export const OPT_ACTIONS: OptAction[] = [
  {
    id: "archive-clones",
    title: "Archive the three App Builder clones",
    detail:
      "silver-bold-wood-scarlet, civic-moonflowers, and FindYourBase are the same sandbox scaffold. ~288 MB public. They are not Möbii³us source.",
    severity: "high",
    slotId: "archive-dumps",
    artifactIds: ["gh-scarlet", "gh-moon", "gh-findbase"],
    connectLabel: "Archive clones",
  },
  {
    id: "env-rotate",
    title: "Rotate keys in mobiius-ops-console",
    detail:
      "A .env file is committed in the private ops console. Bind the repo as source, then treat keys as burned until they are rotated and gitignored.",
    severity: "high",
    slotId: "mobiius-source",
    artifactIds: ["gh-ops"],
    connectLabel: "Bind ops console",
  },
  {
    id: "archive-forks",
    title: "Park the July 7 fork swarm",
    detail:
      "Seventeen forks in one day with garbled MCP titles. Useful as a lab notebook, not as canon.",
    severity: "medium",
    slotId: "archive-dumps",
    artifactIds: ["gh-fork-swarm"],
    connectLabel: "Archive forks",
  },
  {
    id: "keep-shells",
    title: "Keep DoinBetter names, admit they are shells",
    detail:
      "Floodwater, Whisper, and ALTA are README stubs. Bind the names. Do not copy Michael’s substrate into them.",
    severity: "medium",
    slotId: null,
    artifactIds: ["gh-flood", "gh-whisper", "gh-alta"],
    connectLabel: "Bind product names",
  },
  {
    id: "michael-line",
    title: "Hold the Michael line",
    detail:
      "Five of his repos pushed today. You have pull-only. Bind them to the boundary slot so they cannot be overwritten from this page.",
    severity: "high",
    slotId: "michael-boundary",
    artifactIds: [
      "mk-substrate",
      "mk-terminal",
      "mk-shell",
      "mk-hive",
      "mk-civic-core",
      "mk-epicon",
    ],
    connectLabel: "Bind boundary",
  },
  {
    id: "connectus-spec",
    title: "Lock Connectus as spec, not code",
    detail:
      "UZFL fold adapter + HG-00–HG-12 + the Dunn live-feedback pitch are the English spec. Bind them. Do not start a repo.",
    severity: "high",
    slotId: "connectus-spec",
    artifactIds: ["drop-uzfl", "drop-hypergraphs", "drop-dunn"],
    connectLabel: "Bind spec",
  },
  {
    id: "cat-labs-visuals",
    title: "Separate Cat Labs visuals from Möbii³us",
    detail:
      "The STIRT shirt is merch. The tool-star is a Physical Phones / Cat Labs mark, not the Möbii³us logo.",
    severity: "medium",
    slotId: null,
    artifactIds: ["drop-shirt", "drop-toolstar"],
    connectLabel: "Bind visuals",
  },
  {
    id: "catgpt-lane",
    title: "Open a CatGPT lane, off the Möbii³us tree",
    detail:
      "Evidence digest, identity 2-hop, and the 376-APK graph describe CatGPT LLC / Physical Phones / a Samsung snapshot. Keep them together. They are not ops-console source.",
    severity: "medium",
    slotId: "catgpt-surface",
    artifactIds: ["drop-evidence", "drop-2hop", "drop-apk-graph"],
    connectLabel: "Bind CatGPT",
  },
];

export const DROPS: DropClass[] = [
  {
    artifactId: "drop-uzfl",
    title: "UZFL Fold Adapter",
    what: "Buddy at the center. Speech → canonical action. Guardian deny-by-default. This is Connectus.",
    slotId: "connectus-spec",
    image: "/drops/uzfl-adapter.png",
  },
  {
    artifactId: "drop-hypergraphs",
    title: "AI Federation hypergraphs",
    what: "13 hypergraphs (HG-00 master through HG-12 hardware). Higher-order spec for agents, evidence, MCP, firmware.",
    slotId: "connectus-spec",
  },
  {
    artifactId: "drop-dunn",
    title: "D.O.N.E. pitch",
    what: "Absurdist resume wrapping a real ask: live interactive surface instead of waiting on email. Spec tone, not HR.",
    slotId: "connectus-spec",
  },
  {
    artifactId: "drop-shirt",
    title: "STIRT merch",
    what: "Cat Labs joke about unconstrained builds. Visuals folder.",
    slotId: "cat-labs-visuals",
    image: "/drops/cat-labs-stirt.png",
  },
  {
    artifactId: "drop-toolstar",
    title: "Tool-star mark",
    what: "Garden tools arranged as a hexagram. Brand for Physical Phones / Cat Labs — not the Möbii³us mark.",
    slotId: "cat-labs-mark",
    image: "/drops/tool-star.jpg",
  },
  {
    artifactId: "drop-evidence",
    title: "Evidence digest",
    what: "Observed vs inferred. CatGPT LLC, askcatgpt.com, Physical Phones, Smooth Media, Samsung a17xsq. No malware proven.",
    slotId: "catgpt-surface",
  },
  {
    artifactId: "drop-2hop",
    title: "2-hop identity graph",
    what: "Operator Gmail cluster linked to CatGPT records and device files. Context graph, not a source tree.",
    slotId: "catgpt-surface",
  },
  {
    artifactId: "drop-apk-graph",
    title: "APK inventory hairball",
    what: "376 firmware paths. Unreadable as a map. Bind as evidence, do not try to operate from it.",
    slotId: "catgpt-surface",
  },
];

export const HYPERGRAPHS: { id: string; name: string; lane: string }[] = [
  { id: "HG-00", name: "Master system", lane: "Connectus" },
  { id: "HG-01", name: "Agent orchestration", lane: "Connectus" },
  { id: "HG-02", name: "Evidence / provenance", lane: "CatGPT evidence" },
  { id: "HG-03", name: "Public share ingestion", lane: "Connectus" },
  { id: "HG-04", name: "Provider federation", lane: "Connectus" },
  { id: "HG-05", name: "MCP capability", lane: "Connectus" },
  { id: "HG-06", name: "Security / trust", lane: "Voice keys" },
  { id: "HG-07", name: "RN / KMP platform", lane: "Future" },
  { id: "HG-08", name: "Embedded gateway", lane: "Physical Phones" },
  { id: "HG-09", name: "Workflow lifecycle", lane: "Connectus" },
  { id: "HG-10", name: "Temporal memory", lane: "Connectus" },
  { id: "HG-11", name: "Evaluation / attribution", lane: "Connectus" },
  { id: "HG-12", name: "Release / hardware", lane: "Physical Phones" },
];

const ACTION_TRIAGE: Record<RepoAction, Triage> = {
  keep: "keep",
  shell: "keep",
  archive: "archive",
  boundary: "boundary",
  triage: "rename",
};

export function actionTriage(action: RepoAction): Triage {
  return ACTION_TRIAGE[action];
}

export function formatSize(kb: number): string {
  if (!kb) return "—";
  if (kb >= 1024) return `${(kb / 1024).toFixed(0)} MB`;
  return `${kb} KB`;
}

export function assessmentCsv(): string {
  const rows = [...YOURS_REPOS, ...MICHAEL_REPOS];
  const header = [
    "owner",
    "fullName",
    "action",
    "language",
    "sizeKb",
    "visibility",
    "fork",
    "pushed",
    "issues",
    "note",
    "href",
  ];
  const escape = (v: string | number | boolean) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };
  const body = rows.map((r) =>
    [
      r.owner,
      r.fullName,
      r.action,
      r.language,
      r.sizeKb,
      r.visibility,
      r.fork,
      r.pushed,
      r.issues,
      r.note,
      r.href,
    ]
      .map(escape)
      .join(","),
  );
  return [header.join(","), ...body].join("\n");
}

export function assessmentJson(boundIds: Set<string>) {
  return {
    generatedAt: new Date().toISOString(),
    assessedAt: ASSESSED_AT,
    verdict: VERDICT,
    actions: OPT_ACTIONS.map((a) => ({
      ...a,
      bound: a.artifactIds.every((id) => boundIds.has(id)),
    })),
    yours: YOURS_REPOS,
    michael: MICHAEL_REPOS,
    drops: DROPS,
    hypergraphs: HYPERGRAPHS,
  };
}
