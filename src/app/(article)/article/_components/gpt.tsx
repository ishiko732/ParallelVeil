'use client'
import React from "react";
import useChatStream from "@magicul/react-chat-stream";


export default function GPT() {

    const {messages, input, handleInputChange, handleSubmit} = useChatStream({
        options: {
            url: '/api/openai',
            method: 'POST',
        },
        method: {
            type: 'query',
            key: 'prompt2',
        },
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
            <form onSubmit={handleSubmit}>
                <input type="text" onChange={handleInputChange} value={input}/>
                <button type="submit">Send</button>
            </form>
        </div>
    );
}