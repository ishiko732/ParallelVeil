import process from "process";
import fetchApi from "@/vendor/openai/lib/fetch-api";
import {ChatGPTMessage, OpenAIStreamPayload} from "@/vendor/openai/type";


export const runtime = 'edge'
const modelBaseURL = "https://api.openai.com/v1/models"

const baseHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.secret_key!}`,
}

export async function listModels(model?: string) {
    return await fetchApi(model ? `${modelBaseURL}/${model}` : modelBaseURL, {
        method: "GET",
        headers: baseHeaders
    })
}

export async function chatCompletion(payload: OpenAIStreamPayload) {
    return await fetchApi("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: baseHeaders,
        body: JSON.stringify(payload),
    });
}