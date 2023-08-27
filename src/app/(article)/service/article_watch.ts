import {FilePath, FileValue} from "@@/collect/system/src/FileStores";

export async function getArticlePaths(path?: string[]) {
    return fetch(`http://127.0.0.1:3000/api/collect/article/${path ? path.join("/") : ""}`, {
        cache: 'no-cache'
    }).then(res => res.json()) as Promise<FilePath[]>
}

export async function getArticleData(path: string[]) {
    return fetch(`http://127.0.0.1:3000/api/collect/article/${path ? path.join("/") : ""}`, {
        cache: 'no-cache',
        headers: {
            'value': '1'
        }
    }).then(res => res.json()).catch(err => {
        return {err: 404}
    }) as Promise<FileValue>
}

export interface articleData {
    id: string,
    text: string,
    title: string,
    date: string,
    language: string

}