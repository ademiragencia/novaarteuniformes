import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "./utils";
import {
  type Garment,
  type ImageLayer,
  type SizeKey,
  type Side,
  type StudioLayer,
  emptySizes,
  getGarment,
  hexToRgb,
  resolvePlacement,
} from "./studio";
import type { TechniqueId } from "./products";

export type Artwork = {
  src: string;
  name: string;
  removedBg?: boolean;
  alreadyTransparent?: boolean;
};

type StudioState = {
  garmentId: string;
  color: string;
  side: Side;
  technique: TechniqueId;
  layers: StudioLayer[];
  selectedId: string | null;
  sizes: Record<SizeKey, number>;
  company: string;
  notes: string;
  artwork: Artwork | null;
  placements: string[];
  previewOpen: boolean;
  setGarment: (id: string) => void;
  setColor: (hex: string) => void;
  setSide: (side: Side) => void;
  setTechnique: (t: TechniqueId) => void;
  select: (id: string | null) => void;
  addText: () => void;
  addImage: (src: string, name?: string) => void;
  updateLayer: (id: string, patch: Partial<StudioLayer>) => void;
  removeLayer: (id: string) => void;
  setSize: (key: SizeKey, n: number) => void;
  setCompany: (v: string) => void;
  setNotes: (v: string) => void;
  setArtwork: (art: Artwork) => void;
  clearArtwork: () => void;
  togglePlacement: (id: string) => void;
  setPreviewOpen: (open: boolean) => void;
  reset: () => void;
  loadFromProduct: (garmentId: string, color?: string) => void;
};

function syncPlacementLayers(
  artwork: Artwork | null,
  placements: string[],
  garmentId: string,
  existing: StudioLayer[],
): StudioLayer[] {
  const extras = existing.filter((l) => l.type === "text" || !l.placementId);
  if (!artwork) return extras;
  const next: StudioLayer[] = placements.map((id) => {
    const p = resolvePlacement(id, garmentId);
    const prev = existing.find((l) => l.placementId === id) as ImageLayer | undefined;
    return {
      id: prev?.id ?? uid("img"),
      type: "image",
      side: p?.side ?? "front",
      src: artwork.src,
      x: prev?.x ?? p?.x ?? 0.5,
      y: prev?.y ?? p?.y ?? 0.4,
      scale: prev?.scale ?? p?.scale ?? 1,
      rotation: prev?.rotation ?? 0,
      placementId: id,
      name: artwork.name,
    };
  });
  return [...next, ...extras];
}

const defaults = {
  garmentId: "tshirt",
  color: "#F4F1EA",
  side: "front" as Side,
  technique: "dtf" as TechniqueId,
  layers: [] as StudioLayer[],
  selectedId: null as string | null,
  sizes: emptySizes(),
  company: "",
  notes: "",
  artwork: null as Artwork | null,
  placements: [] as string[],
  previewOpen: false,
};

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      ...defaults,
      setGarment: (id) => {
        const s = get();
        set({
          garmentId: id,
          layers: syncPlacementLayers(s.artwork, s.placements, id, []).concat(
            s.layers.filter((l) => l.type === "text" || !l.placementId),
          ),
        });
      },
      setColor: (hex) => set({ color: hex }),
      setSide: (side) => set({ side, selectedId: null }),
      setTechnique: (technique) => set({ technique }),
      select: (id) => set({ selectedId: id }),
      addText: () => {
        const id = uid("txt");
        const { r, g, b } = hexToRgb(get().color);
        const light = (r * 299 + g * 587 + b * 114) / 1000 > 150;
        const layer: StudioLayer = {
          id,
          type: "text",
          side: get().side,
          text: "SUA MARCA",
          font: "Oswald",
          fill: light ? "#171411" : "#F4F1EA",
          x: 0.5,
          y: 0.42,
          scale: 1,
          rotation: 0,
        };
        set({ layers: [...get().layers, layer], selectedId: id });
      },
      addImage: (src, name) => {
        const id = uid("img");
        const layer: StudioLayer = {
          id,
          type: "image",
          side: get().side,
          src,
          x: 0.5,
          y: 0.42,
          scale: 1,
          rotation: 0,
          name,
        };
        set({ layers: [...get().layers, layer], selectedId: id });
      },
      updateLayer: (id, patch) =>
        set({
          layers: get().layers.map((l) =>
            l.id === id ? ({ ...l, ...patch } as StudioLayer) : l,
          ),
        }),
      removeLayer: (id) => {
        const layer = get().layers.find((l) => l.id === id);
        set({
          layers: get().layers.filter((l) => l.id !== id),
          placements: layer?.placementId
            ? get().placements.filter((p) => p !== layer.placementId)
            : get().placements,
          selectedId: get().selectedId === id ? null : get().selectedId,
        });
      },
      setSize: (key, n) =>
        set({ sizes: { ...get().sizes, [key]: Math.max(0, Math.round(n)) } }),
      setCompany: (company) => set({ company }),
      setNotes: (notes) => set({ notes }),
      setArtwork: (art) => {
        const placements = get().placements.length
          ? get().placements
          : [get().side === "back" ? "back-center" : "chest-center"];
        set({
          artwork: art,
          placements,
          layers: syncPlacementLayers(art, placements, get().garmentId, get().layers),
        });
      },
      clearArtwork: () =>
        set({
          artwork: null,
          placements: [],
          layers: get().layers.filter((l) => l.type === "text" || !l.placementId),
        }),
      togglePlacement: (id) => {
        const on = get().placements.includes(id);
        const placements = on
          ? get().placements.filter((p) => p !== id)
          : [...get().placements, id];
        const p = resolvePlacement(id, get().garmentId);
        set({
          placements,
          layers: syncPlacementLayers(
            get().artwork,
            placements,
            get().garmentId,
            get().layers,
          ),
          side: p?.side ?? get().side,
        });
      },
      setPreviewOpen: (previewOpen) => set({ previewOpen }),
      reset: () => set({ ...defaults, sizes: emptySizes(), layers: [], placements: [] }),
      loadFromProduct: (garmentId, color) =>
        set({
          garmentId,
          color: color ?? get().color,
        }),
    }),
    {
      name: "nova-arte-studio-v3",
      skipHydration: true,
      partialize: (s) => ({
        garmentId: s.garmentId,
        color: s.color,
        technique: s.technique,
        sizes: s.sizes,
        company: s.company,
        notes: s.notes,
        placements: s.placements,
        artwork: s.artwork,
        layers: s.layers,
        side: s.side,
      }),
    },
  ),
);

export function currentGarment(): Garment {
  return getGarment(useStudio.getState().garmentId);
}
