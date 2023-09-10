"use client";
import { ReactNode } from "react";
import ShowModalStore from "@/app/(article)/article/_hooks/showModalStore";
import { packageNote } from "@/app/(article)/article/_hooks/pvStore";
import { SpanStoreProvider } from "@/app/(article)/article/_hooks/useSpanStore";
import { ShowModalStoreProvider } from "@/app/(article)/article/_hooks/useShowModal";

export default function RootStoreProvider({
  children,
  packages,
}: {
  children: ReactNode;
  packages?: packageNote;
}) {
  const store = new ShowModalStore();

  return (
    <SpanStoreProvider packages={packages}>
      <ShowModalStoreProvider>{children}</ShowModalStoreProvider>
    </SpanStoreProvider>
  );
}
