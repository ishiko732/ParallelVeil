"use client";
import { useToc } from "@/app/(article)/article/_hooks/useToc";
import React from "react";

export default function ArticleToc({ toc }: { toc?: string }) {
  const reactToc = useToc(toc);
  return reactToc !== undefined ? (
    <div className="prose prose-stone mt-5 max-w-4xl m-auto fixed">
      {reactToc}
    </div>
  ) : null;
}
