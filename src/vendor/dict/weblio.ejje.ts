/**
 * URL:https://ejje.weblio.jp/
 * see: https://github.com/ishiko732/WordSearch/blob/master/Weblio-English.py
 * see: https://zhuanlan.zhihu.com/p/191635270
 *
 */
import * as jsdom from "jsdom";
import superagent from "superagent";

export enum search_type {
    exact = 'と一致する',
    prefix = 'で始まる',
    contains = 'を含む',
    suffix = 'で終わる',
    text = 'を解説文に含む'
}

export type searchType = 'exact' | 'prefix' | 'contains' | 'suffix' | 'text'

const {JSDOM} = jsdom;

export default async function search(word: string, searchType: searchType = 'exact') {
    const query = encodeURI(`https://ejje.weblio.jp/content_find?query=${word}&searchType=${searchType}`)
    const dom = await superagent.get(query).then(res => res.text).then(text => new JSDOM(text).window.document.body) as HTMLBodyElement
    let means = dom.getElementsByClassName('content-explanation ej') as HTMLCollectionOf<Element>;
    if (means.length == 0) {
        means = dom.getElementsByClassName('content-explanation je') as HTMLCollectionOf<Element>
    }
    return Array.from(means).map(mean => mean.innerHTML.replace(/\s+/, ''))
}
