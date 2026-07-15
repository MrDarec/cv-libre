"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CVData, emptyCV } from "@/types/cv";

interface CVStore {
  cv: CVData;
  step: number;
  setCV: (updater: (cv: CVData) => CVData) => void;
  setStep: (step: number) => void;
  reset: () => void;
}

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      cv: emptyCV(),
      step: 0,
      setCV: (updater) => set((s) => ({ cv: updater(s.cv) })),
      setStep: (step) => set({ step }),
      reset: () => set({ cv: emptyCV(), step: 0 }),
    }),
    { name: "cv-libre-storage" }
  )
);
