"use client";

import { articleData } from "@/app/(article)/service/article_watch";
import Date from "@/app/(fsrs)/fsrs/_components/date";
import React from "react";
import ArticleHeadChip from "@/app/(article)/article/_components/articleHeadChip";
import { useSpanStore } from "@/app/(article)/article/_hooks/useSpanStore";

export default function ArticleHead({
  articleData,
}: {
  articleData: articleData;
}) {
  const store = useSpanStore();
  return (
    <>
      <h2 className={"text-4xl font-extrabold dark:text-white"}>
        {articleData.title}
      </h2>
      <div className={"flex items-center justify-center pt-3"}>
        <ArticleHeadChip>
          <Date date={articleData.date} className={"inline-block w-auto"} />
        </ArticleHeadChip>
        <ArticleHeadChip>{articleData.language || "default"}</ArticleHeadChip>
        <ArticleHeadChip>Word {store.count}</ArticleHeadChip>
      </div>
    </>
  );
}
