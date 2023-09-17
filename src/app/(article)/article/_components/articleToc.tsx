"use client";
import { useToc } from "@/app/(article)/article/_hooks/useToc";
import React from "react";

export default function ArticleToc({ toc }: { toc?: string }) {
  const reactToc = useToc(toc);
  return reactToc !== undefined ? (
    <div className="prose prose-stone mt-5 text-ellipsis m-auto fixed max-w-1/6">
      {reactToc}
    </div>
  ) : null;
}
