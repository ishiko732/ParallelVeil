import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {remark} from 'remark';
import html from 'remark-html';

const ArticlesDirectory = path.join(process.cwd(), "collect", "article");

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

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Combine the data with the id and contentHtml
    return {
        id,
        contentHtml,
        ...matterResult.data,
    };
}