import {NextRequest, NextResponse} from "next/server";
import {openai, proxyInitConfig} from "@/vendor/openai";
import {OpenAIStream} from "@/vendor/openai/openAIStream";
import prompt from "@/vendor/openai/prompt";

export async function GET(request: NextRequest) {
    const response = await openai.listModels(proxyInitConfig);
    return NextResponse.json(response.data, {status: 200})
}

export async function POST(request: NextRequest) {
    const {text, language, origin, phrase} = await request.json()
    if (text == null || language == null || origin == null || phrase == null) {
        NextResponse.json(null, {status: 400})
    }
    const user_query = JSON.stringify({text, language, origin, phrase})
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
    return new Response(stream);
}