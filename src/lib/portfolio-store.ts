import { create } from "zustand";
import type { Apartment } from "./mock-data";

interface PortfolioState {
  scored: Apartment[];
  add: (a: Apartment) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  scored: [],
  add: (a) => set((s) => ({ scored: [a, ...s.scored.filter((x) => x.address !== a.address)] })),
}));