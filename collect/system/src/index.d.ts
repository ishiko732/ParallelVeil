type language = "zh-CN" | "ja-JP" | "en-US";

interface markdownTag {
    title: string,
    date: string,
    language: language

    [key: string]: any
}