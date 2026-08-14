import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "./utils";
import {
  type Garment,
  type SizeKey,
  type Side,
  type StudioLayer,
  emptySizes,
  getGarment,
  hexToRgb,
} from "./studio";
import type { TechniqueId } from "./products";

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
  setGarment: (id: string) => void;
  setColor: (hex: string) => void;
  setSide: (side: Side) => void;
  setTechnique: (t: TechniqueId) => void;
  select: (id: string | null) => void;
  addText: () => void;
  addImage: (src: string) => void;
  updateLayer: (id: string, patch: Partial<StudioLayer>) => void;
  removeLayer: (id: string) => void;
  setSize: (key: SizeKey, n: number) => void;
  setCompany: (v: string) => void;
  setNotes: (v: string) => void;
  reset: () => void;
  loadFromProduct: (garmentId: string, color?: string) => void;
};

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
};

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      ...defaults,
      setGarment: (id) => set({ garmentId: id }),
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
      addImage: (src) => {
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
        };
        set({ layers: [...get().layers, layer], selectedId: id });
      },
      updateLayer: (id, patch) =>
        set({
          layers: get().layers.map((l) =>
            l.id === id ? ({ ...l, ...patch } as StudioLayer) : l,
          ),
        }),
      removeLayer: (id) =>
        set({
          layers: get().layers.filter((l) => l.id !== id),
          selectedId: get().selectedId === id ? null : get().selectedId,
        }),
      setSize: (key, n) =>
        set({ sizes: { ...get().sizes, [key]: Math.max(0, Math.round(n)) } }),
      setCompany: (company) => set({ company }),
      setNotes: (notes) => set({ notes }),
      reset: () => set({ ...defaults, sizes: emptySizes(), layers: [] }),
      loadFromProduct: (garmentId, color) =>
        set({
          garmentId,
          color: color ?? get().color,
        }),
    }),
    { name: "nova-arte-studio", skipHydration: true },
  ),
);

export function currentGarment(): Garment {
  return getGarment(useStudio.getState().garmentId);
}
