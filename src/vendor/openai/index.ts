import {Configuration, OpenAIApi} from 'openai'
import process from "process";

// Use Next.js edge runtime
export const config = {
    runtime: 'edge',
}
export const openAIConfig = new Configuration({
    apiKey: process.env.secret_key!,

})

export const openai = new OpenAIApi(openAIConfig)


export const proxyInitConfig = {
    proxy: {
        host: process.env.proxy_host!!,
        port: Number(process.env.proxy_port || 1081)
    }
}