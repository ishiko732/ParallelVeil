import { Card, Note, Prisma } from "@prisma/client";
import prisma from "@/service/db/index";
import { search as jishoSearch, taskAudio } from "@/vendor/dict/jisho";
import search from "@/vendor/dict/weblio.ejje";
import { loggerInfo } from "@/config/pinoConfig";

export async function updateAndCreateInterpret(
  data: Prisma.InterpretUncheckedCreateInput,
) {
  const { word, language, model, interpret } = data;
  const existingInterpret = await prisma.interpret.findFirst({
    where: { word, language, model },
  });

  if (existingInterpret) {
    prisma.interpret.update({
      where: {
        word_language_model: {
          word,
          language,
          model,
        },
      },
      data: {
        interpret,
      },
    });
    return existingInterpret;
  }
  loggerInfo("createInterpret", { word, language, model });
  return prisma.interpret.create({
    data: {
      word,
      language,
      model,
      interpret,
    },
  });
}

export async function createInterpret(
  data: Prisma.InterpretUncheckedCreateInput,
) {
  const { word, language, model, interpret } = data;
  const dataDB = await findInterpret({ word, language, model });
  if (dataDB) {
    return;
  }
  loggerInfo("createInterpret", { word, language, model });
  return await prisma.interpret.create({
    data: {
      word,
      language,
      model,
      interpret,
    },
  });
}

export async function findInterpret(data: Prisma.InterpretWhereInput) {
  const { word, language, model, interpret } = data;
  return await prisma.interpret.findFirst({
    where: { word, language, model },
  });
}

export async function autoInterpret(
  words: { [key: string]: Note & { card: Card | null } },
  targetLanguage: string = "ja_JP",
) {
  for (let key of Object.keys(words)) {
    let word = words[key].text;
    const awaitData = [
      autoJisho(word, targetLanguage),
      autoEjje(word, targetLanguage),
    ];
    await Promise.all(awaitData);
  }
}

async function autoJisho(word: string, language: string) {
  let interpret = await findInterpret({
    word,
    model: "jisho1",
    language: language,
  });
  if (!interpret) {
    // noinspection ES6MissingAwait
    taskAudio(word);
    // jisho
    let data = await jishoSearch(word, 1).then((res) => res.json());
    if (data) {
      createInterpret({
        word: word,
        language: language,
        model: "jisho1",
        interpret: JSON.stringify(data),
      });
    }
  }
}

async function autoEjje(word: string, language: string) {
  let interpret = await findInterpret({
    word,
    model: "ejje",
    language: language,
  });
  if (!interpret) {
    // ejje
    let data = await search(word, "exact");
    if (data) {
      createInterpret({
        word: word,
        language: language,
        model: "ejje",
        interpret: JSON.stringify(data),
      });
    }
  }
}
