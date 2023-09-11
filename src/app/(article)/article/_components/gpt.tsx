"use client";
import React, { FormEvent } from "react";
import { useOpenAiStream } from "@/vendor/openai/lib/useTextStream";
import OpenAiIcon from "@/vendor/openai/openAiIcon";
import SendIcon from "@/components/SendIcon";
import UserIcon from "@/vendor/openai/UserIcon";

export default function GPT({
  word,
  phrase,
}: {
  word: string;
  phrase: string;
}) {
  const { messages, inputRef, handleSubmit, loading } = useOpenAiStream(
    "/api/openai",
    {
      method: "POST",
    },
  );

  const genRequest = () => {
    return JSON.stringify({
      language: "en-us",
      origin: "zh-cn",
      query: inputRef.current?.value || word,
      phrase: phrase,
    });
  };
  return (
    <div>
      {messages.map((message, index) => (
        <div key={message.id}>
          <p className={"py-1"}>
            {message.role === "bot" ? (
              <OpenAiIcon className={"inline"} />
            ) : (
              <UserIcon className={"inline"} />
            )}
            {message.content}
          </p>
        </div>
      ))}
      {loading ? <p>response...</p> : null}
      <form
        onSubmit={(e) => handleSubmit(e, genRequest())}
        className={"flex items-center w-full"}
      >
        <label htmlFor="helpGPT" className="sr-only">
          Search
        </label>
        <div className="relative w-full pl-2">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <OpenAiIcon />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Talk to ChatGPT on ParallelVeil"
            required
          />
        </div>
        <button
          type="submit"
          className="px-2 py-1.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <SendIcon />
          <span className="sr-only">Send</span>
        </button>
      </form>
    </div>
  );
}
