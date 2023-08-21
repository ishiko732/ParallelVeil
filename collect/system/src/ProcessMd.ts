import 'log-timestamp';
import fs from "fs";
import path from 'path';
import matter from "gray-matter";


export async function getMdData(filePath: string) {
    let id = path.basename(filePath, path.extname(filePath))
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const matterResult = matter(fileContents);
        return {
            id,
            text: matterResult.content,
            ...matterResult.data,
        };
    } catch {
        return undefined;
    }
}