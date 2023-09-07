"use client";
import {
  ObserveClientNote,
  ObserveNote,
  ObserveServerNote,
  packageNote,
} from "@/app/(article)/article/_hooks/pvStore";
import { createContext, ReactNode, useContext } from "react";

const StoreContext = createContext<ObserveNote | undefined>(undefined);

export function useSpanStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useSpanStore must be used within ObserveNote");
  }
  return context;
}

export function SpanStoreProvider({
  children,
  packages,
}: {
  children: ReactNode;
  packages?: packageNote;
}) {
  const store = (
    typeof window === "undefined"
      ? new ObserveServerNote(packages)
      : new ObserveClientNote(packages)
  ) as ObserveNote;

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}
