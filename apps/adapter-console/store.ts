import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  SEED_ARTIFACTS,
  type Artifact,
  type PlatformId,
  type SlotId,
} from "../../packages/capability-registry/catalog";

export type Binding = {
  id: string;
  artifactId: string;
  slotId: SlotId;
  boundAt: string;
};

export type AlphaMode = "shared" | "split";
export type ViewId = "bind" | "map" | "distill" | "constants";

type CanonState = {
  bindings: Binding[];
  customArtifacts: Artifact[];
  liveArtifacts: Artifact[];
  alphaMode: AlphaMode;
  view: ViewId;
  selectedPlatformId: PlatformId;
  sheetArtifactId: string | null;
  bind: (artifactId: string, slotId: SlotId) => void;
  bindMany: (pairs: { artifactId: string; slotId: SlotId }[]) => number;
  unbind: (bindingId: string) => void;
  unbindArtifact: (artifactId: string) => void;
  addCustom: (artifact: Artifact) => void;
  mergeLive: (artifacts: Artifact[]) => void;
  setAlphaMode: (mode: AlphaMode) => void;
  setView: (view: ViewId) => void;
  setPlatform: (id: PlatformId) => void;
  openSheet: (artifactId: string | null) => void;
};

function nid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useCanon = create<CanonState>()(
  persist(
    (set, get) => ({
      bindings: [],
      customArtifacts: [],
      liveArtifacts: [],
      alphaMode: "shared",
      view: "bind",
      selectedPlatformId: "github-yours",
      sheetArtifactId: null,
      bind: (artifactId, slotId) => {
        const existing = get().bindings.find((b) => b.artifactId === artifactId);
        const next: Binding = {
          id: existing?.id ?? nid(),
          artifactId,
          slotId,
          boundAt: new Date().toISOString(),
        };
        set({
          bindings: [
            ...get().bindings.filter((b) => b.artifactId !== artifactId),
            next,
          ],
          sheetArtifactId: null,
        });
      },
      bindMany: (pairs) => {
        let current = get().bindings;
        const now = new Date().toISOString();
        for (const p of pairs) {
          const existing = current.find((b) => b.artifactId === p.artifactId);
          const next: Binding = {
            id: existing?.id ?? nid(),
            artifactId: p.artifactId,
            slotId: p.slotId,
            boundAt: now,
          };
          current = [
            ...current.filter((b) => b.artifactId !== p.artifactId),
            next,
          ];
        }
        set({ bindings: current, sheetArtifactId: null });
        return pairs.length;
      },
      unbind: (bindingId) =>
        set({ bindings: get().bindings.filter((b) => b.id !== bindingId) }),
      unbindArtifact: (artifactId) =>
        set({
          bindings: get().bindings.filter((b) => b.artifactId !== artifactId),
        }),
      addCustom: (artifact) =>
        set({ customArtifacts: [...get().customArtifacts, artifact] }),
      mergeLive: (artifacts) => {
        const byId = new Map(get().liveArtifacts.map((a) => [a.id, a]));
        for (const a of artifacts) byId.set(a.id, a);
        set({ liveArtifacts: [...byId.values()] });
      },
      setAlphaMode: (alphaMode) => set({ alphaMode }),
      setView: (view) => set({ view }),
      setPlatform: (selectedPlatformId) => set({ selectedPlatformId }),
      openSheet: (sheetArtifactId) => set({ sheetArtifactId }),
    }),
    {
      name: "canon-bind",
      partialize: (s) => ({
        bindings: s.bindings,
        customArtifacts: s.customArtifacts,
        alphaMode: s.alphaMode,
      }),
    },
  ),
);

export function allArtifacts(s: {
  customArtifacts: Artifact[];
  liveArtifacts: Artifact[];
}): Artifact[] {
  const byId = new Map<string, Artifact>();
  for (const a of SEED_ARTIFACTS) byId.set(a.id, a);
  for (const a of s.liveArtifacts) byId.set(a.id, a);
  for (const a of s.customArtifacts) byId.set(a.id, a);
  return [...byId.values()];
}

export function useArtifacts(): Artifact[] {
  const customArtifacts = useCanon((s) => s.customArtifacts);
  const liveArtifacts = useCanon((s) => s.liveArtifacts);
  return useMemo(
    () => allArtifacts({ customArtifacts, liveArtifacts }),
    [customArtifacts, liveArtifacts],
  );
}
