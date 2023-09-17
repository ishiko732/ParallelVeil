import { articleData } from "@/app/(article)/service/article_watch";
import { convertMdToHTML } from "@/service/analyzer/help_split";
import { createArticle } from "@/service/db/article";
import { Article, Note, Card } from "@prisma/client";
import { createNote } from "@/service/db/note";
import process from "process";
import { getMDToc } from "@/app/(article)/article/_hooks/useToc";
import { autoInterpret } from "@/service/db/interpret";

export default async function getArticle(aid: string, articleDB: articleData) {
  const collect = new Set<string>();
  const promiseAll = [
    convertMdToHTML(articleDB.text, collect),
    createArticle({ link: aid }),
    getMDToc(articleDB.text, {}),
  ];
  const [convertToHtml, dbArticle, toc]: (string | Article | undefined)[] =
    await Promise.all(promiseAll);
  const promiseWords = Array.from(collect).map((word) =>
    createNote({
      text: word,
    }),
  );
  const words: { [key: string]: Note & { card: Card | null } } = {};
  Array.from(await Promise.all(promiseWords)).forEach(
    (word) => (words[word.text] = word),
  );
  const uid = Number(process.env.uid);
  // autoInterpret(words, "ja_JP");

  return {
    convertToHtml: convertToHtml as string,
    dbArticle,
    words,
    uid,
    toc: String(toc),
  };
}
