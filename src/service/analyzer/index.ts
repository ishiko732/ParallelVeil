import {Node} from "unist";
import {visit} from "unist-util-visit";


// const prisma = new PrismaClient()

function store(fileName: String) {
    // prisma.article.findFirst({
    //     where:fi
    // })
}

export function checkAST(option = {}) {
    return (tree: Node) => {
        visit(tree, 'root', (node) => {
            console.log(tree);
        });
    };
}

const regex = /[".,:;!?()]/;

export function regexSymbol(str: string): boolean {
    return regex.test(str);
}