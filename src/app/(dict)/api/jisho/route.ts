import {NextRequest, NextResponse} from "next/server";
import {search, taskAudio} from "@/vendor/dict/jisho";


export async function GET(request: NextRequest) {
    const {query, page} = {
        query: request.nextUrl.searchParams.get("query"),
        page: request.nextUrl.searchParams.get("page") || '1'
    }
    if (query == null) {
        return NextResponse.json(null, {status: 400})
    }
    // noinspection ES6MissingAwait
    taskAudio(query)
    const data = await search(query, Number(page)).then((res) => res.json());
    return NextResponse.json(data);
}