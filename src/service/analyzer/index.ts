import {Node} from "unist";
import {visit} from "unist-util-visit";
import {loggerDebug} from "@/config/pinoConfig";


// const prisma = new PrismaClient()

function store(fileName: String) {
    // prisma.article.findFirst({
    //     where:fi
    // })
}

export function checkAST(option = {}) {
    return (tree: Node) => {
        visit(tree, 'root', (node) => {
            loggerDebug("root", tree)
        });
    };
}

const regex = /[".,:;!?()]/;

export function regexSymbol(str: string): boolean {
    return regex.test(str);
}