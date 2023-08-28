import {findNote_by_nid as findNote} from "@/service/db/note";
import {type NextRequest, NextResponse} from 'next/server'

export async function GET(request: NextRequest, {params}: { params: { nid: string } }) {
    const nid = params.nid
    const data = await findNote({
        nid: nid
    })
    return NextResponse.json(data, {status: 200})
}