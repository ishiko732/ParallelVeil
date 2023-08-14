'use client'
import React from "react";
import {useOpenAiStream} from "@/vendor/openai/lib/useTextStream";


export default function GPT({word, phrase}: { word: string, phrase: string }) {

    const {messages, inputRef, handleSubmit, loading} = useOpenAiStream(
        '/api/openai', {
            method: "POST"
        });

    return (
        <div>
            {messages.map((message, index) => (
                <div key={message.id}>
                    <p>
                        {message.role}: {message.content}
                    </p>
                </div>
            ))}
            {loading ? <p>response...</p> : null}
            <form onSubmit={(e => handleSubmit(e, JSON.stringify({
                language: "en-us",
                origin: "zh-cn",
                query: inputRef.current?.value || word,
                phrase: phrase
            })))}>
                <input type="text" ref={inputRef}/>
                <button type="submit">Send</button>
            </form>
        </div>
    );
}