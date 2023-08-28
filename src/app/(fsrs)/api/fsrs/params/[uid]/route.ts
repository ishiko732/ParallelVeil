import {NextRequest, NextResponse} from "next/server";
import {findParamsByUid} from "@/service/db/params";
import {transParameters} from "@/app/(fsrs)/fsrs/help";

export async function GET(request: NextRequest, {params}: { params: { uid: string } }) {
    const uid = Number(params.uid)
    const data = await findParamsByUid({
        uid
    })

    return NextResponse.json(data && transParameters(data), {status: 200})
}