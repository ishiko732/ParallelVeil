"use client";
import { createContext, ReactNode, useContext } from "react";
import ShowModalStore from "@/app/(article)/article/_hooks/showModalStore";

const ShowModalStoreContext = createContext<ShowModalStore | undefined>(
  undefined,
);

export function useShowModalStoreStore() {
  const context = useContext(ShowModalStoreContext);
  if (context === undefined) {
    throw new Error(
      "useShowModalStoreStore must be used within ShowModalStore",
    );
  }
  return context;
}

export function ShowModalStoreProvider({ children }: { children: ReactNode }) {
  const store = new ShowModalStore();
  return (
    <ShowModalStoreContext.Provider value={store}>
      {children}
    </ShowModalStoreContext.Provider>
  );
}
