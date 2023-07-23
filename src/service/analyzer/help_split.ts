import {Span, Text} from "lowlight/lib/core";
import {unified} from "unified";
import remarkParse from "remark-parse";
import highlight from "remark-highlight.js";
import {checkAST, regexSymbol} from "@/service/analyzer/index";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import {Literal, Node, Parent} from "unist";
import {visit} from "unist-util-visit";
import splitWords from "./en_US";


export function convertParagraph() {
    return (tree: Node) => {
        visit(tree, 'paragraph', (node: Parent) => {
            let {data} = node
            node.type = 'element'
            if (!data) {
                data = {}
                node.data = data
            }
            data.hProperties = {
                className: ['paragraph']
            }
        })
    }

}


/**
 *
 * @param {string} value
 * @param {Array<string>} className
 * @return {import('hast').Span}
 */
export function addSpan(value: string, className: Array<string> = []): Span {
    return {
        type: 'element',
        tagName: 'span',
        properties: {className: regexSymbol(value) ? [] : className},
        children: [addText(value)],
    }
}

/**
 * @param {string} value
 * @return {import('hast').Text}
 */
function addText(value: string): Text {
    return {type: 'text', value: value + " "}
}


export async function convertMdToHTML(text: string, collect: Set<string> = new Set<string>()): Promise<string> {
    return unified()
        .use(remarkParse) // Markdown → mdast
        .use(convertParagraph)
        .use(remarkTest, collect)
        .use(highlight)
        .use(checkAST) //mdastにアクセス
        .use(remarkRehype) // mdast → hast
        .use(rehypeStringify) //  hast → HTML
        // .use(checkAST) //mdastにアクセス
        .processSync(text).toString();
}


function remarkTest(collect: Set<string>, splitCallback: Function = splitWords) {
    return (tree: Node) => {
        visit(tree, (node) => {
            let {type, data, value} = node as Literal
            if (!data) {
                data = {}
                node.data = data
            }
            if (type === 'code') {
                return
            }
            if (value) {
                if (type === 'text') {
                    node.type = 'element'
                }
                const words: Span[] = splitCallback((value as string)).map((text: string) => {
                        !regexSymbol(text) && collect.add(text)
                        return addSpan(text, ['note'])
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