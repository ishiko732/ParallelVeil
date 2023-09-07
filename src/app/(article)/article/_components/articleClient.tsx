"use client";
import { observer } from "mobx-react-lite";
import { articleData } from "../../service/article_watch";
import {
  SpanStoreProvider,
  useSpanStore,
} from "@/app/(article)/article/_hooks/useSpanStore";
import ArticleToc from "@/app/(article)/article/_components/articleToc";
import ArticleHead from "@/app/(article)/article/_components/articleHead";
import ExtractContext from "@/context/extractContext";
import CollectSelect from "@/app/(article)/article/_components/showModal/collectSelect";
import PopupWord from "@/app/(article)/article/_components/showModal/popupWord";
import React, { createElement, Fragment } from "react";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeSlug from "rehype-slug";
import rehypeReact from "rehype-react";
import PVImage from "@/app/(article)/article/_components/unified/PVImage";
import MyLink from "@/app/(article)/article/_components/unified/MyLink";
import PVSpan from "@/app/(article)/article/_components/unified/PVSpan";

export const ArticleClient = observer(function ArticleClient(props: {
  articleData: articleData;
  convertToHtml: string;
  toc?: string;
}) {
  const { articleData, convertToHtml, toc } = props;
  const store = useSpanStore();
  const toReactNode = (content: string) => {
    return unified()
      .use(rehypeParse, {
        fragment: true,
      })
      .use(rehypeSlug)
      .use(rehypeReact, {
        createElement,
        Fragment,
        components: {
          img: PVImage,
          a: MyLink,
          span: PVSpan,
        },
      })
      .processSync(convertToHtml).result as React.ReactElement;
  };

  return (
    <div className="prose prose-lg max-w-none dark:text-white sm:flex w-full justify-around">
      <div className={"hidden sm:block sm:w-1/6 sm:my-4 sm:h-full relative"}>
        <ArticleToc toc={props.toc} />
      </div>
      <div className={"w-full sm:w-5/6"}>
        <ArticleHead articleData={articleData} />
        <hr className="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded dark:bg-gray-700" />
        {/*<ExtractContext.Provider value={extractValue}>*/}
        {/*    <CollectSelect />*/}
        {/*    <PopupWord />*/}
        {/*</ExtractContext.Provider>*/}
        {/*<div ref={contentRef}*/}
        {/*     className="pv-container"*/}
        {/*     dangerouslySetInnerHTML={{__html: convertToHtml}}/>*/}
        <div className="break-words whitespace-normal">
          {toReactNode(convertToHtml)}
        </div>
      </div>
    </div>
  );
});
