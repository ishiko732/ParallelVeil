/**
 * API: https://jisho.org/api/v1/search/words?keyword={単語/ENGLISH}
 * API: https://jisho.org/api/v1/search/words?keyword=#jlpt-n{4}&page={2}
 * page: https://jisho.org/search/{単語/ENGLISH}
 * From: https://jisho.org/forum/54fefc1f6e73340b1f160000-is-there-any-kind-of-search-api
 * must encodeURI(query)
 * licence : ELECTRONIC DICTIONARY RESEARCH AND DEVELOPMENT GROUP GENERAL DICTIONARY LICENCE STATEMENT
 */
import fs from "fs";
import * as jsdom from "jsdom";
import path from "path";
import { AudioDirectory } from "@/config/dict";
import fetchApi from "@/vendor/openai/lib/fetch-api";
import { loggerError } from "@/config/pinoConfig";

const jisho_api = "https://jisho.org/api/v1/search/words?keyword=";
const jisho_page = "https://jisho.org/search/";

/**
 * Wrapper for Jisho API
 * @param  {String}  keyword
 * @param  {number} page
 * @return {Promise}
 */

export async function search(keyword: string = "", page: number = 1) {
  const query = encodeURI(jisho_api + keyword + "&page=" + page);
  return await fetchApi(query, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    },
  });
}

const { JSDOM } = jsdom;

export async function taskAudio(word: string = "") {
  if (word === "") {
    return;
  }
  const mp3Dir = path.join(AudioDirectory, "mp3");
  const oggDir = path.join(AudioDirectory, "ogg");
  try {
    fs.mkdirSync(mp3Dir, { recursive: true });
    fs.mkdirSync(oggDir, { recursive: true });
  } catch (err) {
    loggerError("Failed to create audio directories", { err });
  }
  const mp3FilesPath = fs.readdirSync(path.join(AudioDirectory, "mp3"));
  const oggFilesPath = fs.readdirSync(path.join(AudioDirectory, "ogg"));
  const audioPromise: Promise<void>[] = [];
  const audios = await getAudioUrls(word);
  if (!audios) {
    return;
  }
  audios.forEach((audio) => {
    const mp3filePath = path.join(AudioDirectory, "mp3", audio.name + ".mp3");
    const oggfilePath = path.join(AudioDirectory, "ogg", audio.name + ".ogg");
    audio.mp3Url &&
      !mp3FilesPath.includes(audio.name + ".mp3") &&
      audioPromise.push(downloadFile(audio.mp3Url, mp3filePath));
    audio.oggUrl &&
      !oggFilesPath.includes(audio.name + ".ogg") &&
      audioPromise.push(downloadFile(audio.oggUrl, oggfilePath));
  });
}

export async function getAudioUrls(word: string = "") {
  const query = encodeURI(jisho_page + word);
  const _data = await fetchApi(query, {
    method: "GET",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    },
  });
  if (!_data) {
    return;
  }
  const data = await _data.text();
  const dom = new JSDOM(data).window.document;
  const audioElements = dom.querySelectorAll("audio");
  const list = [];
  for (let elem of audioElements) {
    const underscoreIndex = elem.id.lastIndexOf("_");
    const colonIndex = elem.id.lastIndexOf(":");
    const _word = elem.id.substring(underscoreIndex + 1, colonIndex);
    const _kata = elem.id.substring(colonIndex + 1);
    list.push({
      name: _word + "_" + _kata,
      mp3Url: _getAudioSourceByType(elem, "mp3"),
      oggUrl: _getAudioSourceByType(elem, "ogg"),
    });
  }
  return list;
}

function _getAudioSourceByType(elem: HTMLAudioElement, type: "mp3" | "ogg") {
  let e;
  if ("mp3" == type) {
    e = elem.querySelector(
      "audio > source[type='audio/mpeg']",
    ) as HTMLSourceElement | null;
  } else if ("ogg" === type) {
    e = elem.querySelector(
      "audio > source[type='audio/ogg']",
    ) as HTMLSourceElement | null;
  }
  return e && e.src ? "https:" + e.src : null;
}

export async function downloadFile(
  mp3Url: string,
  filePath: string,
): Promise<void> {
  try {
    const response = await fetch(mp3Url, {
      cache: "force-cache",
    });
    const fileStream = fs.createWriteStream(filePath);
    const stream = new WritableStream({
      write(chunk) {
        fileStream.write(chunk);
      },
    });
    fileStream.on("finish", () => {
      fileStream.close();
    });
    fileStream.on("error", (err) => {
      throw err;
    });
    if (!response.body) {
      return;
    }
    await response.body.pipeTo(stream);
  } catch (e) {}
}
