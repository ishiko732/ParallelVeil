import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {ArticlesDirectory} from "@/config/article";

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
    const fileNames = fs.readdirSync(id ? path.join(ArticlesDirectory, id) : ArticlesDirectory);
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            }
        };
    });
}

export async function getArticleData(id: string) {
    // if (fs.lstatSync(path.join(ArticlesDirectory, id)).isDirectory()) {
    //     return {
    //         id,
    //         directory: true
    //     }
    // }
    const fullPath = path.join(ArticlesDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

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