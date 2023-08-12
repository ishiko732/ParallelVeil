import {NextRequest, NextResponse} from "next/server";
import {openai, proxyInitConfig} from "@/vendor/openai";
import prompt from "@/vendor/openai/prompt";
import {OpenAIStream} from "@/vendor/openai/openAIStream";
// Use Next.js edge runtime
export const runtime = 'edge'

export async function GET(request: NextRequest) {
    try {
        const response = await openai.listModels(proxyInitConfig);
        return NextResponse.json(response.data, {status: 200})
    } catch (error: any) {
        console.log(error)
        return new Response(JSON.stringify(error), {
            status: 400,
            headers: {
                "content-type": "application/json",
            },
        })
    }
}

export async function POST(request: NextRequest) {
    let user_query = ""
    try {
        const data = await request.json()
        const {query, language, origin, phrase} = data
        if (query == null || language == null || origin == null || phrase == null) {
            NextResponse.json(null, {status: 400})
        }
        user_query = JSON.stringify({query, language, origin, phrase})
    } catch (e) {
        const {searchParams} = new URL(request.url)
        const prompt2 = searchParams.get('prompt2')
        user_query = prompt2!!
    }

    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            stream: true,
            max_tokens: 1000,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 1,
            presence_penalty: 1,
            messages: [
                {role: "system", content: prompt},
                {role: "user", content: user_query}],
        }, {
            ...proxyInitConfig,
            responseType: "stream"
        });
        const stream = await OpenAIStream(response);
        return new Response(stream, {headers: {'Content-Type': 'text/event-stream', 'Connection': 'keep-alive'}});
    } catch (error: any) {
        console.log(error)
        return new Response(JSON.stringify(error), {
            status: 400,
            headers: {
                "content-type": "application/json",
            },
        })
    }
}