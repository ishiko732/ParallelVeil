import { NextRequest, NextResponse } from "next/server";
import { search, taskAudio } from "@/vendor/dict/jisho";
import {
  findInterpret,
  updateAndCreateInterpret,
} from "@/service/db/interpret";

const model = "jisho";
const language = "ja_JP";

export async function GET(request: NextRequest) {
  const { query, page } = {
    query: request.nextUrl.searchParams.get("query"),
    page: request.nextUrl.searchParams.get("page") || "1",
  };
  if (query == null) {
    return NextResponse.json(null, { status: 400 });
  }
  const interpret = await findInterpret({
    word: query,
    language,
    model: model + page,
  });
  if (interpret) {
    return NextResponse.json(JSON.parse(interpret.interpret), { status: 200 });
  }
  // noinspection ES6MissingAwait
  taskAudio(query);
  const data = await search(query, Number(page)).then((res) => res.json());
  if (data) {
    // noinspection ES6MissingAwait
    updateAndCreateInterpret({
      word: query,
      language,
      model: model + page,
      interpret: JSON.stringify(data),
    });
  }
  return NextResponse.json(data);
}
