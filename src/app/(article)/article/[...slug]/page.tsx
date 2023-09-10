import React from "react";
import { FSRSProvider } from "@/context/fsrsContext";
import { findParamsByUid } from "@/service/db/params";
import { transParameters } from "@/app/(fsrs)/fsrs/help";
import { Metadata } from "next";
import {
  articleData,
  getArticleData,
  getArticlePaths,
} from "@/app/(article)/service/article_watch";
import ArticlePaths from "@/app/(article)/article/_components/articlePaths";
import { notFound } from "next/navigation";
import getArticle from "@/app/(article)/article/_hooks/getArticle";
import { SpanStoreProvider } from "@/app/(article)/article/_hooks/useSpanStore";
import { ArticleClient } from "@/app/(article)/article/_components/articleClient";
import { ShowModalStoreProvider } from "@/app/(article)/article/_hooks/useShowModal";
import RootStoreProvider from "@/app/(article)/article/_hooks/useRootStore";

export default async function Page({ params }: { params: { slug: string[] } }) {
  const { slug } = params;
  const _id = slug.join("/");
  const fileValue = await getArticleData(slug);
  if (fileValue.err) {
    notFound();
  }
  if (Array.isArray(fileValue) || !fileValue.file) {
    return <ArticlePaths articlePaths={await getArticlePaths(slug)} />;
  }
  const articleData = fileValue.value as articleData;
  const { toc, convertToHtml, dbArticle, words, uid } = await getArticle(
    _id,
    articleData,
  );
  return (
    <>
      <FSRSProvider
        uid={uid}
        p={transParameters(await findParamsByUid({ uid }))}
      >
        <RootStoreProvider packages={words}>
          <ArticleClient
            articleData={articleData}
            convertToHtml={convertToHtml.toString()}
            toc={toc}
          />
          {/*<ArticleClientComponent*/}
          {/*  articleData={articleData}*/}
          {/*  convertToHtml={convertToHtml.toString()}*/}
          {/*  words={words}*/}
          {/*  toc={toc}*/}
          {/*/>*/}
        </RootStoreProvider>
      </FSRSProvider>
    </>
  );
}

type Props = {
  params: { slug: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const fileValue = await getArticleData(params.slug);
  if (fileValue.err) {
    return {
      title: "Parallel Veil",
    };
  }
  if (Array.isArray(fileValue) || !fileValue.file) {
    return {
      title: `Parallel Veil - ${params.slug.join("/") || "Article"}`,
    };
  }
  const articleData = fileValue.value as articleData;
  if (articleData.language == undefined) {
    articleData.language = "Default";
  }
  return {
    title: `${articleData.title}(${articleData.language})`,
    description: articleData.text.substring(0, 300),
  };
}
