import { Span, Text } from "lowlight/lib/core";
import { unified } from "unified";
import remarkParse from "remark-parse";
import highlight from "remark-highlight.js";
import { regexSymbol } from "@/service/analyzer/index";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import splitWords from "./en_US";
import type { Node } from "unified/lib";
import rehypeSlug from "rehype-slug";

export function convertParagraph() {
  return (tree: Node) => {
    visit(tree, "paragraph", (node: Node) => {
      let { data } = node;
      node.type = "element";
      if (!data) {
        data = {};
        node.data = data;
      }
      data.hProperties = {
        className: ["paragraph"],
      };
    });
  };
}


/**
 *
 * @param {string} value
 * @param {Array<string>} className
 * @return {import('hast').Span}
 */
export function addSpan(value: string, className: Array<string> = []): Span {
    return {
      type: "element",
      tagName: "span",
      properties: {
        className: regexSymbol(value) ? [] : className,
      },
      children: [addText(value)],
    };
}

/**
 * @param {string} value
 * @return {import('hast').Text}
 */
function addText(value: string): Text {
  return { type: "text", value: value };
}

export async function convertMdToHTML(
  text: string,
  collect: Set<string> = new Set<string>(),
): Promise<string> {
  return (
    unified()
      .use(remarkParse) // Markdown → mdast
      .use(convertParagraph)
      .use(remarkTest, collect)
      .use(highlight)
      // .use(checkAST) //mdastにアクセス
      .use(remarkRehype, { allowDangerousHtml: true }) // mdast → hast
      .use(rehypeSlug)
      .use(rehypeStringify, { allowDangerousHtml: true }) //  hast → HTML
      // .use(checkAST) //mdastにアクセス
      .processSync(text)
      .toString()
  );
}

function remarkTest(collect: Set<string>, splitCallback: Function = splitWords) {
    return (tree: Node) => {
        visit(tree, (node) => {
            let {type, data, value} = node as Node & { value?: string }
            if (!data) {
                data = {}
                node.data = data
            }
            if (type === 'code' || type === 'heading') {
                return
            }
            if (type === 'list') {
                if (!data) {
                    data = {}
                    node.data = data
                }
                data.hProperties = {
                    className: ['max-w-md', 'list-disc', 'list-inside', 'dark:text-gray-400', 'mt-4', 'mb-4'],
                }
            }
            if (value) {
                if (type === 'text') {
                    node.type = 'element'
                }
                const words: Span[] = splitCallback((value as string)).map((text: string) => {
                  !regexSymbol(text) && collect.add(text);
                  return addSpan(text, ["note"]);
                }
                )
                if (!data) {
                    data = {}
                    node.data = data
                }
                data.hProperties = {
                    className: ['pv-content'],
                    "data-value": value
                }
                data.hChildren = words
            }
        })
    }
}