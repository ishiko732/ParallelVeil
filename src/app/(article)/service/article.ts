import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {ArticlesDirectory, CollectDirectory} from "@/config/article";
import {loggerDebug} from "@/config/pinoConfig";

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

export function getAllArticleIds(id?: string) {
    const dir = id ? path.join(ArticlesDirectory, id) : ArticlesDirectory
    const fileNames = fs.readdirSync(dir);
    return fileNames.map((fileName) => {
        const _id = fileName.replace(/\.md$/, '')
        const _path = path.join(dir, _id).replace(CollectDirectory, "")
        return {
            params: {
                id: _id,
                path: _path,
            }
        };
    });
}

export async function getArticleData(id: string) {
    loggerDebug("artcileId", {id})
    try {
        const fullPath = path.join(ArticlesDirectory, `${id}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        return {
            id,
            text: matterResult.content,
            ...(matterResult.data as markdownTag),
        };
    } catch {
        return getAllArticleIds(id)
    }


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