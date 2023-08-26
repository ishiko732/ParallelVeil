import {NextRequest} from "next/server";

export async function GET(request: NextRequest) {
    return fetch("http://0.0.0.0:3001/article", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        cache: 'no-cache'
    })
}