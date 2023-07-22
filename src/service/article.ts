import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {ArticlesDirectory} from "@/config/article";
import {language} from "@/models/language";

interface markdownTag {
    title: string,
    date: string,
    language: language,
    learning: string
}

export interface article {
    id: String
}

export function getSortedArticlesData() {
    // Get file names under /article
    const fileNames = fs.readdirSync(ArticlesDirectory);
    const allArticlesData: article[] = fileNames.map((fileName) => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(ArticlesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);
        // Combine the data with the id
        return {
            id,
            ...matterResult.data,
        };
    });
    // Sort Articles by date
    return allArticlesData.sort((a, b) => {
        // @ts-ignore
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getAllArticleIds() {
    const fileNames = fs.readdirSync(ArticlesDirectory);
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            }
        };
    });
}

export async function getArticleData(id: String) {
    const fullPath = path.join(ArticlesDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // const toReact=remarkReact({
    //     createElement: React.createElement,
    //     remarkReactComponents: components, // additional options
    //     sanitize: false
    // })

    // Use remark to convert markdown into HTML string
    // const processedContent = await unified()
    //     .use(remarkParse)
    //     .use(remarkTest)
    //     .use(highlight)
    //     .use(html)
    //     .process(matterResult.content);
    // // matterResult.content md原始内容
    // const contentHtml = processedContent.value as string
    return {
        id,
        text: matterResult.content,
        ...(matterResult.data as markdownTag),
    };
}


// const remarkTest: () => Transformer = () => {
//     const transformer: Transformer = (tree: Node) => {
//         const root = tree as Root;
//         root.children.push({
//             type: 'paragraph',
//             children: [
//                 {
//                     type: 'text',
//                     value: 'hogehoge',
//                 },
//             ],
//         });
//         return root;
//     };
//
//     return transformer;
// };