import { NextRequest, NextResponse } from "next/server";
import search, { searchType } from "@/vendor/dict/weblio.ejje";
import {
  findInterpret,
  updateAndCreateInterpret,
} from "@/service/db/interpret";

const model = "ejje";
const language = "ja_JP";

export async function GET(request: NextRequest) {
  const { query, searchType } = {
    query: request.nextUrl.searchParams.get("query") as string | null,
    searchType: (request.nextUrl.searchParams.get("searchType") ||
      "exact") as searchType,
  };
  if (query == null) {
    return NextResponse.json(null, { status: 400 });
  }
  const interpret = await findInterpret({
    word: query,
    language,
    model,
  });
  if (interpret) {
    return NextResponse.json(JSON.parse(interpret.interpret), { status: 200 });
  }
  const data = await search(query, searchType);
  if (data) {
    // noinspection ES6MissingAwait
    updateAndCreateInterpret({
      word: query,
      language,
      model,
      interpret: JSON.stringify(data),
    });
  }
  return NextResponse.json(data, { status: 200 });
}
