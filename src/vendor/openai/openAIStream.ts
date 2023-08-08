import {createParser, ParsedEvent, ReconnectInterval,} from "eventsource-parser";
import {AxiosResponse} from "axios";
import {CreateChatCompletionResponse} from "openai";

/**
 * see:https://github.com/wimluk/public-lib/blob/main/tutorials/How%20to%20Stream%20Real-Time%20OpenAI%20API%20Responses/src/utils/openAIStream.ts
 */

export async function OpenAIStream(res: AxiosResponse<CreateChatCompletionResponse, any>) {
    let counter = 0;
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const stream = new ReadableStream({
        async start(controller) {
            // callback
            function onParse(event: ParsedEvent | ReconnectInterval) {
                if (event.type === "event") {
                    const data = event.data;
                    // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
                    if (data === "[DONE]") {
                        controller.close();
                        return;
                    }
                    try {
                        const json = JSON.parse(data);
                        const text = json.choices[0].delta?.content || "";
                        if (counter < 2 && (text.match(/\n/) || []).length) {
                            // this is a prefix character (i.e., "\n\n"), do nothing
                            return;
                        }
                        const queue = encoder.encode(text);
                        controller.enqueue(queue);
                        counter++;
                    } catch (e) {
                        // maybe parse error
                        controller.error(e);
                    }
                }
            }

            // stream response (SSE) from OpenAI may be fragmented into multiple chunks
            // this ensures we properly read chunks and invoke an event for each SSE event stream
            const parser = createParser(onParse);
            // https://web.dev/streams/#asynchronous-iteration
            for await (const chunk of res.data as any) {
                parser.feed(decoder.decode(chunk));
            }
        },
    });

    return stream;
}