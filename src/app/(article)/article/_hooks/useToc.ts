import { unified } from "unified";
import remarkParse from "remark-parse";
import { Options, Result, toc } from "mdast-util-toc";
import { Node } from "unified/lib";
import { visit } from "unist-util-visit";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { Root } from "remark-parse/lib";

export default async function getMDToc(text: string, options?: Options) {
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
      const result = toc(node, options) as Result;
      if (result.map !== undefined) {
        (node as Root).children = [result.map as never];
      } else {
        (tree as Root).children = [];
        return;
      }
    });
  };
};
