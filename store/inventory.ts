import { create } from "zustand";

type StockMode = "IN" | "OUT";

interface ScannedProduct {
  id: string;
  name: string;
  barcode: string;
  stock: number;
}

interface InventoryState {
  mode: StockMode;
  setMode: (mode: StockMode) => void;

  scannedProduct: ScannedProduct | null;
  setScannedProduct: (product: ScannedProduct | null) => void;

  isNewProduct: boolean;
  setIsNewProduct: (isNew: boolean) => void;

  status: { type: "idle" | "success" | "error"; message: string };
  setStatus: (status: { type: "idle" | "success" | "error"; message: string }) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  reset: () => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  mode: "IN",
  setMode: (mode) => set({ mode }),

  scannedProduct: null,
  setScannedProduct: (product) => set({ scannedProduct: product }),

  isNewProduct: false,
  setIsNewProduct: (isNew) => set({ isNewProduct: isNew }),

  status: { type: "idle", message: "" },
  setStatus: (status) => set({ status }),

  loading: false,
  setLoading: (loading) => set({ loading }),

  reset: () =>
    set({
      scannedProduct: null,
      isNewProduct: false,
      status: { type: "idle", message: "" },
      loading: false,
    }),
}));
