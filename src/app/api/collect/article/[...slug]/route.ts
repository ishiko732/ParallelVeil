import {NextRequest} from "next/server";

export async function GET(request: NextRequest, {params}: {
    params: { slug?: string[] },
}) {
    const h_value = request.headers.get("value")
    const value = new URL(request.url).searchParams.get('value')
    const {slug} = params
    let headers = {
        "Content-Type": "application/json",
    } as { [key: string]: string }
    value && (headers['x-tif-value'] = value)
    h_value && (headers['x-tif-value'] = h_value)
    return fetch(`http://127.0.0.1:3001/article/${slug ? slug.join("/") : ''}`, {
        method: "GET",
        headers,
        cache: 'no-cache'
    })
}