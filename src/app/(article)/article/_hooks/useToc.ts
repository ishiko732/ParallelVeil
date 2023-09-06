import { unified } from "unified";
import remarkParse from "remark-parse";
import { Options, Result, toc } from "mdast-util-toc";
import { Node } from "unified/lib";
import { visit } from "unist-util-visit";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { Root } from "remark-parse/lib";
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react";
import React, { createElement, Fragment } from "react";
import MyLink from "@/app/(article)/article/_components/unified/MyLink";
import PVListDisc from "@/app/(article)/article/_components/unified/PVListDisc";
import PVList from "@/app/(article)/article/_components/unified/PVList";

export function useToc(toc?: string) {
  if (!toc) {
    return undefined;
  }
  const reactToc = unified()
    .use(rehypeParse, {
      fragment: true,
    })
    .use(rehypeReact, {
      createElement,
      Fragment,
      components: {
        ul: PVListDisc,
        a: MyLink,
      },
    })
    .processSync(toc);
  return reactToc.result as React.ReactElement;
}

export async function getMDToc(text: string, options?: Options) {
  const toc = await unified()
    .use(remarkParse)
    .use(getToc, options)
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(rehypeStringify)
    .process(text);
  const result = String(toc);
  return result === "" ? undefined : result;
}

export const getToc = (options?: Options) => {
  return (tree: Node) => {
    visit(tree, "root", (node) => {
      const result = toc(node, { maxDepth: 3, ...options }) as Result;
      if (result.map !== undefined) {
        (node as Root).children = [result.map as never];
      } else {
        (tree as Root).children = [];
        return;
      }
    });
  };
};
