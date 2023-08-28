'use client'
import {ChangeEvent, createRef, FormEvent, useRef, useState} from "react";
import openAIStream, {decodeStreamToJson} from "@/vendor/openai/lib/stream";
import {v4 as uuidv4} from 'uuid';
import {loggerError} from "@/config/pinoConfig";

type ChatMessage = {
    role: 'bot' | 'user';
    content: string;
    id: string;
}
const BOT_ERROR_MESSAGE = 'Something went wrong fetching AI response.';
export const useOpenAiStream = (url: string, option?: RequestInit) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const messageRef = createRef<HTMLInputElement>();
    const [loading, setLoading] = useState(false);


    const addMessageToChat = (message: string, role: ChatMessage['role'] = 'user') => {
        setMessages(messages => [...messages, {role, content: message, id: uuidv4()}]);
    };
    const appendMessageToChat = (message: string) => {
        setMessages(messages => {
            const latestMessage = messages[messages.length - 1];

            return [
                ...messages.slice(0, -1),
                {...latestMessage, content: latestMessage.content + message},
            ];
        });
    };
    const fetchAndUpdateAIResponse = async (body?: string) => {
        const response = await fetch(url, body ? {...option, body} : option)
        if (!response.ok) throw new Error(response.statusText);
        const data = response.body
        addMessageToChat('', 'bot');
        for await (const message of decodeStreamToJson(data)) {
            appendMessageToChat(message);
        }
    };
    const handleSubmit = async (e?: FormEvent<HTMLFormElement>, body?: string) => {
        if (!messageRef.current) {
            return
        }
        setLoading(true);
        e?.preventDefault();
        addMessageToChat(messageRef.current.value || "");
        messageRef.current.value = "";
        try {
            await fetchAndUpdateAIResponse(body);
        } catch (e) {
            // @ts-ignore
            loggerError(e)
            addMessageToChat(BOT_ERROR_MESSAGE, 'bot');
        }
        setLoading(false);
    };
    return {
        messages,
        inputRef: messageRef,
        handleSubmit,
        loading
    }

}