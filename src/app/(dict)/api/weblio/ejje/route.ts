import {NextRequest, NextResponse} from "next/server";
import search, {searchType} from "@/vendor/dict/weblio.ejje";


export async function GET(request: NextRequest) {
    const {query, searchType} = {
        query: request.nextUrl.searchParams.get("query") as string | null,
        searchType: (request.nextUrl.searchParams.get("searchType") || 'exact') as searchType,
    }
    if (query == null) {
        return NextResponse.json(null, {status: 400})
    }
    const data = await search(query, searchType)
    return NextResponse.json(data, {status: 200})
}