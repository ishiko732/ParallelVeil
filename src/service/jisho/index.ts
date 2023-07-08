/**
 * API: https://jisho.org/api/v1/search/words?keyword={単語/ENGLISH}
 * API: https://jisho.org/api/v1/search/words?keyword=#jlpt-n{4}&page={2}
 * page: https://jisho.org/search/{単語/ENGLISH}
 * From: https://jisho.org/forum/54fefc1f6e73340b1f160000-is-there-any-kind-of-search-api
 * must encodeURI(query)
 * licence : ELECTRONIC DICTIONARY RESEARCH AND DEVELOPMENT GROUP GENERAL DICTIONARY LICENCE STATEMENT
 */

const jisho_api = "https://jisho.org/api/v1/search/words?keyword="
const jisho_page = "https://jisho.org/search/"


/**
 * Wrapper for Jisho API
 * @param  {String}  keyword
 * @param  {number} page
 * @return {Promise}
 */

export async function search(keyword: string = "", page: number = 1) {
    const query = encodeURI(jisho_api + keyword + "&page=" + page)
    return fetch(query)
}


export async function getAudioUrls(word: string = "") {
    const query = encodeURI(jisho_page + word)
    const data = await fetch(query).then(response => response.text())
    const parser = new DOMParser();
    const dom = parser.parseFromString(data, 'text/html');
    const audioElements = dom.querySelectorAll('audio')
    const list = []
    for (let elem of audioElements) {
        const underscoreIndex = elem.id.lastIndexOf('_')
        const colonIndex = elem.id.lastIndexOf(':')
        const _word = elem.id.substring(underscoreIndex + 1, colonIndex)
        const _kata = elem.id.substring(colonIndex + 1)
        list.push({
            name: _word + "_" + _kata,
            mp3Url: _getAudioSourceByType(elem, "mp3"),
            oggUrl: _getAudioSourceByType(elem, "ogg")
        })
    }
    return list;
}

function _getAudioSourceByType(elem: HTMLAudioElement, type: "mp3" | "ogg") {
    let e
    if ("mp3" == type) {
        e = elem.querySelector('audio > source[type=\'audio/mpeg\']') as HTMLSourceElement | null
    } else if ("ogg" === type) {
        e = elem.querySelector('audio > source[type=\'audio/ogg\']') as HTMLSourceElement | null
    }
    return e && e.src ? e.src : null
}