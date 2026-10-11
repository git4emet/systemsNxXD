export type PlatformId =
  | "github-yours"
  | "github-michael"
  | "drive"
  | "canva"
  | "vercel"
  | "notion"
  | "gmail"
  | "figma"
  | "gamma"
  | "heygen"
  | "dropbox";

export type SlotId =
  | "mobiius-source"
  | "doinbetter-floodwater"
  | "doinbetter-whisper"
  | "doinbetter-alta"
  | "doinbetter-nasa"
  | "cat-labs-mark"
  | "cat-labs-visuals"
  | "voice-buddy"
  | "connectus-spec"
  | "catgpt-surface"
  | "deploy-surface"
  | "michael-boundary"
  | "archive-dumps"
  | "incoming";

export type Triage = "keep" | "rename" | "archive" | "boundary" | "spec";
export type Confidence = "high" | "medium" | "low";
export type Origin = "live" | "plan";

export type Platform = {
  id: PlatformId;
  name: string;
  owner: string;
  status: "connected" | "boundary" | "planned";
  blurb: string;
  liveScan?: "drive" | "gmail";
};

export type Artifact = {
  id: string;
  platformId: PlatformId;
  title: string;
  subtitle: string;
  href?: string;
  kind: string;
  suggestedSlotId: SlotId | null;
  confidence: Confidence;
  origin: Origin;
  updated?: string;
};

export type Slot = {
  id: SlotId;
  name: string;
  path: string;
  triage: Triage;
  blurb: string;
  allowOverwrite: boolean;
};

export type FolderNode = {
  path: string;
  label: string;
  triage: Triage;
  note: string;
};

export const PLATFORMS: Platform[] = [
  {
    id: "github-yours",
    name: "GitHub",
    owner: "git4emet",
    status: "connected",
    blurb: "Your repos. Canonical code lives here.",
  },
  {
    id: "github-michael",
    name: "GitHub",
    owner: "kaizencycle",
    status: "boundary",
    blurb: "Michael’s substrate. Reference only — never overwrite.",
  },
  {
    id: "canva",
    name: "Canva",
    owner: "DoinBetter",
    status: "connected",
    blurb: "Marks, packets, and visual copies.",
  },
  {
    id: "drive",
    name: "Drive",
    owner: "heyMico",
    status: "connected",
    blurb: "Unsorted media drops. Scan to refresh.",
    liveScan: "drive",
  },
  {
    id: "vercel",
    name: "Vercel",
    owner: "dglassesguy-4859",
    status: "connected",
    blurb: "Deploy surfaces linked to GitHub.",
  },
  {
    id: "gmail",
    name: "Gmail",
    owner: "dglassesguy",
    status: "connected",
    blurb: "Threads that carry attachments and checklists.",
    liveScan: "gmail",
  },
  {
    id: "notion",
    name: "Notion",
    owner: "workspace",
    status: "connected",
    blurb: "Almost empty. Bind a page when it exists.",
  },
  {
    id: "figma",
    name: "Figma",
    owner: "connected",
    status: "connected",
    blurb: "No files found. Paste a file URL to bind.",
  },
  {
    id: "gamma",
    name: "Gamma",
    owner: "connected",
    status: "connected",
    blurb: "Decks. Paste a Gamma URL to bind.",
  },
  {
    id: "heygen",
    name: "HeyGen",
    owner: "HyperFrames",
    status: "connected",
    blurb: "No projects yet.",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    owner: "not connected",
    status: "planned",
    blurb: "Overlapping zips. Bind into the folder map.",
  },
];

export const SLOTS: Slot[] = [
  {
    id: "mobiius-source",
    name: "Möbii³us source",
    path: "canon/01-mobiius",
    triage: "keep",
    blurb: "Single source of truth. Ops console and system frame.",
    allowOverwrite: true,
  },
  {
    id: "doinbetter-floodwater",
    name: "Floodwater",
    path: "canon/02-doinbetter/floodwater",
    triage: "keep",
    blurb: "DOSx³ FRAC(t)oolBootBox. Keep the GitHub copy.",
    allowOverwrite: true,
  },
  {
    id: "doinbetter-whisper",
    name: "Fractal Whisper",
    path: "canon/02-doinbetter/whisper",
    triage: "keep",
    blurb: "Self-healing speech-to-text. Adjacent to voice-buddy.",
    allowOverwrite: true,
  },
  {
    id: "doinbetter-alta",
    name: "ALTA Survey",
    path: "canon/02-doinbetter/alta",
    triage: "keep",
    blurb: "Self-healing ALTA survey system.",
    allowOverwrite: true,
  },
  {
    id: "doinbetter-nasa",
    name: "NASA packet",
    path: "canon/02-doinbetter/nasa",
    triage: "keep",
    blurb: "Space to Soil / Beyond the Algorithm materials.",
    allowOverwrite: true,
  },
  {
    id: "cat-labs-mark",
    name: "Cat Labs mark",
    path: "canon/03-cat-labs/mark",
    triage: "keep",
    blurb: "Canonical Möbii³us logo. Duplicates archive.",
    allowOverwrite: true,
  },
  {
    id: "cat-labs-visuals",
    name: "Cat Labs visuals",
    path: "canon/03-cat-labs/visuals",
    triage: "keep",
    blurb: "Visual identity, kept separate from Möbii³us code.",
    allowOverwrite: true,
  },
  {
    id: "voice-buddy",
    name: "Mom voice buddy",
    path: "canon/04-voice",
    triage: "keep",
    blurb: "Needs an API-key-safe deploy pattern before it ships.",
    allowOverwrite: true,
  },
  {
    id: "connectus-spec",
    name: "Connectus",
    path: "canon/05-connectus",
    triage: "spec",
    blurb: "UZFL adapter + hypergraphs. Spec only until English is locked.",
    allowOverwrite: true,
  },
  {
    id: "catgpt-surface",
    name: "CatGPT / Physical Phones",
    path: "canon/06-catgpt",
    triage: "keep",
    blurb: "Separate product cluster. Device evidence stays out of Möbii³us.",
    allowOverwrite: true,
  },
  {
    id: "deploy-surface",
    name: "Deploy surface",
    path: "canon/01-mobiius/deploy",
    triage: "keep",
    blurb: "Vercel project bound to a GitHub repo.",
    allowOverwrite: true,
  },
  {
    id: "michael-boundary",
    name: "Michael boundary",
    path: "canon/90-michael",
    triage: "boundary",
    blurb: "kaizencycle/Mobius-Substrate. Read, cite, never overwrite.",
    allowOverwrite: false,
  },
  {
    id: "archive-dumps",
    name: "Archive dumps",
    path: "canon/99-archive",
    triage: "archive",
    blurb: "Grok-builder clones, fork swarm, dated duplicates.",
    allowOverwrite: true,
  },
  {
    id: "incoming",
    name: "Incoming",
    path: "canon/00-incoming",
    triage: "rename",
    blurb: "Unsorted drops. Bind here, then move to a keep slot.",
    allowOverwrite: true,
  },
];

export const FOLDER_MAP: FolderNode[] = [
  {
    path: "canon/00-incoming",
    label: "Received zips and drops",
    triage: "rename",
    note: "Unsorted. Bind, then promote or archive.",
  },
  {
    path: "canon/01-mobiius",
    label: "Möbii³us source of truth",
    triage: "keep",
    note: "One tree. git4emet/mobiius-ops-console is the candidate.",
  },
  {
    path: "canon/02-doinbetter",
    label: "DoinBetter product systems",
    triage: "keep",
    note: "Floodwater, Whisper, ALTA, NASA packet. No Michael code.",
  },
  {
    path: "canon/03-cat-labs",
    label: "Cat Labs visuals",
    triage: "keep",
    note: "Logo and identity, separate from Möbii³us engineering.",
  },
  {
    path: "canon/04-voice",
    label: "Voice surfaces",
    triage: "keep",
    note: "mom-voice-buddy.html — keys stay server-side.",
  },
  {
    path: "canon/05-connectus",
    label: "Connectus spec",
    triage: "spec",
    note: "UZFL fold adapter + AI-federation hypergraphs. No code yet.",
  },
  {
    path: "canon/06-catgpt",
    label: "CatGPT / Physical Phones",
    triage: "keep",
    note: "askcatgpt.com, physicalphones.com, device evidence. Not Möbii³us.",
  },
  {
    path: "canon/90-michael",
    label: "Michael boundary",
    triage: "boundary",
    note: "kaizencycle/* is reference. Do not fork-overwrite.",
  },
  {
    path: "canon/99-archive",
    label: "Dated duplicates",
    triage: "archive",
    note: "Grok-builder clones, Jul 7 fork swarm, extra logo copies.",
  },
];

export const SEED_ARTIFACTS: Artifact[] = [
  {
    id: "gh-ops",
    platformId: "github-yours",
    title: "mobiius-ops-console",
    subtitle: "Private TypeScript ops console · committed .env — rotate keys",
    href: "https://github.com/git4emet/mobiius-ops-console",
    kind: "repo",
    suggestedSlotId: "mobiius-source",
    confidence: "high",
    origin: "live",
    updated: "2026-07-12",
  },
  {
    id: "gh-flood",
    platformId: "github-yours",
    title: "DoinBetter-Floodwater",
    subtitle: "Möbii³us DOSx³ FRAC(t)oolBootBox · README shell, no source",
    href: "https://github.com/git4emet/DoinBetter-Floodwater",
    kind: "repo",
    suggestedSlotId: "doinbetter-floodwater",
    confidence: "high",
    origin: "live",
    updated: "2026-04-09",
  },
  {
    id: "gh-whisper",
    platformId: "github-yours",
    title: "DoinBetter-Fractal-Whisper",
    subtitle: "Self-healing speech-to-text · README shell · 10 open issues",
    href: "https://github.com/git4emet/DoinBetter-Fractal-Whisper",
    kind: "repo",
    suggestedSlotId: "doinbetter-whisper",
    confidence: "high",
    origin: "live",
    updated: "2025-07-21",
  },
  {
    id: "gh-alta",
    platformId: "github-yours",
    title: "DoinBetter-ALTA-Survey",
    subtitle: "Self-healing ALTA survey · README shell, no source",
    href: "https://github.com/git4emet/DoinBetter-ALTA-Survey",
    kind: "repo",
    suggestedSlotId: "doinbetter-alta",
    confidence: "high",
    origin: "live",
    updated: "2025-07-21",
  },
  {
    id: "gh-next",
    platformId: "github-yours",
    title: "nextjs-boilerplate",
    subtitle: "Linked Vercel project · git4emet",
    href: "https://github.com/git4emet/nextjs-boilerplate",
    kind: "repo",
    suggestedSlotId: "deploy-surface",
    confidence: "medium",
    origin: "live",
    updated: "2026-06-24",
  },
  {
    id: "mk-substrate",
    platformId: "github-michael",
    title: "Mobius-Substrate",
    subtitle: "Civic-technical substrate · kaizencycle",
    href: "https://github.com/kaizencycle/Mobius-Substrate",
    kind: "repo",
    suggestedSlotId: "michael-boundary",
    confidence: "high",
    origin: "live",
    updated: "2026-08-28",
  },
  {
    id: "mk-shell",
    platformId: "github-michael",
    title: "mobius-browser-shell",
    subtitle: "Chambers for Mobius Substrate",
    href: "https://github.com/kaizencycle/mobius-browser-shell",
    kind: "repo",
    suggestedSlotId: "michael-boundary",
    confidence: "high",
    origin: "live",
    updated: "2026-08-28",
  },
  {
    id: "mk-terminal",
    platformId: "github-michael",
    title: "mobius-civic-ai-terminal",
    subtitle: "Civic AI terminal",
    href: "https://github.com/kaizencycle/mobius-civic-ai-terminal",
    kind: "repo",
    suggestedSlotId: "michael-boundary",
    confidence: "high",
    origin: "live",
    updated: "2026-08-28",
  },
  {
    id: "mk-epicon",
    platformId: "github-michael",
    title: "epicon",
    subtitle: "No consequential action without recorded intent",
    href: "https://github.com/kaizencycle/epicon",
    kind: "repo",
    suggestedSlotId: "michael-boundary",
    confidence: "high",
    origin: "live",
    updated: "2026-08-03",
  },
  {
    id: "mk-atlas",
    platformId: "github-michael",
    title: "atlas-paw",
    subtitle: "MobiusATLAS PAW mobile dashboard",
    href: "https://github.com/kaizencycle/atlas-paw",
    kind: "repo",
    suggestedSlotId: "michael-boundary",
    confidence: "medium",
    origin: "live",
    updated: "2026-08-24",
  },
  {
    id: "cv-logo",
    platformId: "canva",
    title: "Mobii3usLogo_1024x1024",
    subtitle: "Canonical mark · custom 1024",
    href: "https://www.canva.com/d/p7v5tLE31DjfXJn",
    kind: "mark",
    suggestedSlotId: "cat-labs-mark",
    confidence: "high",
    origin: "live",
    updated: "2026-05-22",
  },
  {
    id: "cv-logo-copy-a",
    platformId: "canva",
    title: "Copy of Mobii3usLogo_1024x1024",
    subtitle: "Duplicate mark — archive after binding the original",
    href: "https://www.canva.com/d/WKT5r-B1B-4aezy",
    kind: "mark",
    suggestedSlotId: "cat-labs-mark",
    confidence: "medium",
    origin: "live",
  },
  {
    id: "cv-agg",
    platformId: "canva",
    title: "mobiius_125_aggregation.docx",
    subtitle: "2-page aggregation doc",
    href: "https://www.canva.com/d/sqpIBJTqmYa5IpA",
    kind: "doc",
    suggestedSlotId: "mobiius-source",
    confidence: "medium",
    origin: "live",
  },
  {
    id: "cv-nasa",
    platformId: "canva",
    title: "NASA Beyond the Algorithm packet",
    subtitle: "Onboarding packet copy",
    href: "https://www.canva.com/d/GTriQX5j9qIeMjv",
    kind: "packet",
    suggestedSlotId: "doinbetter-nasa",
    confidence: "high",
    origin: "live",
  },
  {
    id: "cv-where",
    platformId: "canva",
    title: "WhereBuddy Shared Conversation Rollup",
    subtitle: "Import rollup",
    href: "https://www.canva.com/d/TmmF5sE6KEwABmA",
    kind: "doc",
    suggestedSlotId: "incoming",
    confidence: "low",
    origin: "live",
  },
  {
    id: "cv-offline",
    platformId: "canva",
    title: "Discover Offline",
    subtitle: "Custom visual",
    href: "https://www.canva.com/d/vYA4F7cb3cQt39R",
    kind: "visual",
    suggestedSlotId: "cat-labs-visuals",
    confidence: "medium",
    origin: "live",
  },
  {
    id: "vc-next",
    platformId: "vercel",
    title: "nextjs-boilerplate",
    subtitle: "Hobby team · linked to git4emet/nextjs-boilerplate",
    href: "https://vercel.com/dglassesguy-4859s-projects/nextjs-boilerplate",
    kind: "project",
    suggestedSlotId: "deploy-surface",
    confidence: "high",
    origin: "live",
  },
  {
    id: "nt-welcome",
    platformId: "notion",
    title: "Welcome to Notion",
    subtitle: "Starter page — not a system artifact",
    href: "https://app.notion.com/p/32b2fcc80bbd80df84f3e10858bb305b",
    kind: "page",
    suggestedSlotId: null,
    confidence: "low",
    origin: "live",
  },
  {
    id: "gm-buddy",
    platformId: "gmail",
    title: "buddy — archive drop",
    subtitle: "RobbinsBuddyLogdure.pdf + watermark media",
    kind: "thread",
    suggestedSlotId: "incoming",
    confidence: "medium",
    origin: "live",
    updated: "2026-08-27",
  },
  {
    id: "gm-nasa",
    platformId: "gmail",
    title: "NASA Space to Soil checklist",
    subtitle: "Final submission checklist in-thread",
    kind: "thread",
    suggestedSlotId: "doinbetter-nasa",
    confidence: "medium",
    origin: "live",
    updated: "2026-08-25",
  },
  {
    id: "db-voice",
    platformId: "dropbox",
    title: "mom-voice-buddy.html",
    subtitle: "Voice surface. Bind, then apply API-key-safe deploy.",
    kind: "html",
    suggestedSlotId: "voice-buddy",
    confidence: "high",
    origin: "plan",
  },
  {
    id: "db-ops-zip",
    platformId: "dropbox",
    title: "mobiius-ops dump.zip",
    subtitle: "Overlapping zip. Promote if newer than GitHub.",
    kind: "zip",
    suggestedSlotId: "incoming",
    confidence: "medium",
    origin: "plan",
  },
  {
    id: "db-flood-zip",
    platformId: "dropbox",
    title: "DoinBetter-Floodwater-copy.zip",
    subtitle: "Likely duplicate of the GitHub repo — archive.",
    kind: "zip",
    suggestedSlotId: "doinbetter-floodwater",
    confidence: "low",
    origin: "plan",
  },
  {
    id: "db-cat-zip",
    platformId: "dropbox",
    title: "CatLabs-visuals.zip",
    subtitle: "Visual pack. Keep separate from Möbii³us code.",
    kind: "zip",
    suggestedSlotId: "cat-labs-visuals",
    confidence: "high",
    origin: "plan",
  },
  {
    id: "db-michael-zip",
    platformId: "dropbox",
    title: "Mobius-Substrate-fork.zip",
    subtitle: "Boundary. Do not treat as yours to overwrite.",
    kind: "zip",
    suggestedSlotId: "michael-boundary",
    confidence: "high",
    origin: "plan",
  },
  {
    id: "db-connectus",
    platformId: "dropbox",
    title: "connectus-notes.zip",
    subtitle: "Spec material only. No code slot.",
    kind: "zip",
    suggestedSlotId: "connectus-spec",
    confidence: "medium",
    origin: "plan",
  },
  {
    id: "gh-scarlet",
    platformId: "github-yours",
    title: "silver-bold-wood-scarlet",
    subtitle: "122 MB Grok App Builder clone · identical to civic-moonflowers",
    href: "https://github.com/git4emet/silver-bold-wood-scarlet",
    kind: "repo",
    suggestedSlotId: "archive-dumps",
    confidence: "high",
    origin: "live",
    updated: "2026-09-15",
  },
  {
    id: "gh-moon",
    platformId: "github-yours",
    title: "civic-moonflowers",
    subtitle: "122 MB Grok App Builder clone · same tree as scarlet",
    href: "https://github.com/git4emet/civic-moonflowers",
    kind: "repo",
    suggestedSlotId: "archive-dumps",
    confidence: "high",
    origin: "live",
    updated: "2026-09-14",
  },
  {
    id: "gh-findbase",
    platformId: "github-yours",
    title: "FindYourBase",
    subtitle: "44 MB same scaffold (AGENTS.md + startup.sh). Not product source.",
    href: "https://github.com/git4emet/FindYourBase",
    kind: "repo",
    suggestedSlotId: "archive-dumps",
    confidence: "high",
    origin: "live",
    updated: "2026-09-13",
  },
  {
    id: "gh-fork-swarm",
    platformId: "github-yours",
    title: "July 7 fork swarm",
    subtitle: "17 forks with garbled MCP descriptions. Experiments, not canon.",
    href: "https://github.com/git4emet?tab=repositories&type=fork",
    kind: "forks",
    suggestedSlotId: "archive-dumps",
    confidence: "high",
    origin: "live",
    updated: "2026-07-07",
  },
  {
    id: "mk-hive",
    platformId: "github-michael",
    title: "mobius-hive",
    subtitle: "Pushed today. Reference only.",
    href: "https://github.com/kaizencycle/mobius-hive",
    kind: "repo",
    suggestedSlotId: "michael-boundary",
    confidence: "high",
    origin: "live",
    updated: "2026-09-23",
  },
  {
    id: "mk-civic-core",
    platformId: "github-michael",
    title: "Civic-Protocol-Core",
    subtitle: "Python civic protocol. Boundary.",
    href: "https://github.com/kaizencycle/Civic-Protocol-Core",
    kind: "repo",
    suggestedSlotId: "michael-boundary",
    confidence: "high",
    origin: "live",
    updated: "2026-09-23",
  },
  {
    id: "drop-uzfl",
    platformId: "canva",
    title: "UZFL Conversation / Fold Adapter",
    subtitle: "v0.1 Buddy adapter. LISTEN → MAP → FOLD → GATE → ROUTE → RECEIPT",
    kind: "diagram",
    suggestedSlotId: "connectus-spec",
    confidence: "high",
    origin: "live",
    updated: "2026-09-22",
  },
  {
    id: "drop-hypergraphs",
    platformId: "dropbox",
    title: "AI Federation hypergraphs",
    subtitle: "HG-00–HG-12. Architecture spec, not implementation.",
    kind: "zip",
    suggestedSlotId: "connectus-spec",
    confidence: "high",
    origin: "live",
    updated: "2026-09-22",
  },
  {
    id: "drop-dunn",
    platformId: "gmail",
    title: "David Dunn D.O.N.E. pitch",
    subtitle: "Satire resume; last pages are the live-feedback software proposal.",
    kind: "pdf",
    suggestedSlotId: "connectus-spec",
    confidence: "medium",
    origin: "live",
  },
  {
    id: "drop-shirt",
    platformId: "canva",
    title: "Stupid STIRT merch",
    subtitle: "Cat Labs joke merch. Not Möbii³us engineering.",
    kind: "visual",
    suggestedSlotId: "cat-labs-visuals",
    confidence: "high",
    origin: "live",
  },
  {
    id: "drop-toolstar",
    platformId: "canva",
    title: "Tool-star mark",
    subtitle: "Garden tools as a hexagram. Physical Phones / Cat Labs, not the Möbii³us logo.",
    kind: "mark",
    suggestedSlotId: "cat-labs-mark",
    confidence: "medium",
    origin: "live",
  },
  {
    id: "drop-evidence",
    platformId: "drive",
    title: "Evidence digest (cleaned)",
    subtitle: "Samsung/a17xsq snapshot + CatGPT LLC public records. No compromise proven.",
    kind: "report",
    suggestedSlotId: "catgpt-surface",
    confidence: "high",
    origin: "live",
    updated: "2026-09-19",
  },
  {
    id: "drop-2hop",
    platformId: "drive",
    title: "Identity 2-hop graph",
    subtitle: "Operator Gmail cluster × CatGPT LLC × device files. Context, not canon source.",
    kind: "graph",
    suggestedSlotId: "catgpt-surface",
    confidence: "medium",
    origin: "live",
  },
  {
    id: "drop-apk-graph",
    platformId: "drive",
    title: "376 APK inventory graph",
    subtitle: "Unreadable hairball of firmware paths. Keep as evidence, do not promote.",
    kind: "graph",
    suggestedSlotId: "catgpt-surface",
    confidence: "medium",
    origin: "live",
  },
];

export const FACTOR_144000 = "2⁷ · 3² · 5³";
export const ALPHA = "0.743";

export function slotById(id: SlotId): Slot {
  const slot = SLOTS.find((s) => s.id === id);
  if (!slot) throw new Error(`Unknown slot ${id}`);
  return slot;
}

export function platformById(id: PlatformId): Platform {
  const p = PLATFORMS.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown platform ${id}`);
  return p;
}
