"use client";

import React from "react";
import { useChat } from "ai/react";
import { Send, Bot, User } from "lucide-react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Chat header */}
      <div className="bg-white dark:bg-zinc-800 shadow-sm py-4 px-6 fixed top-0 w-full">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          AI Chat Assistant
        </h1>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto pt-20 pb-36 px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-3 ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar */}
              <div className={`order-${m.role === "user" ? "2" : "1"}`}>
                {m.role === "user" ? (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Message bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  m.role === "user"
                    ? "bg-blue-500 text-white order-1"
                    : "bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 order-2"
                } shadow-sm`}
              >
                {m.toolInvocations ? (
                  <pre className="overflow-x-auto text-sm">
                    {JSON.stringify(m.toolInvocations, null, 2)}
                  </pre>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full bg-white dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-700 p-4"
      >
        <div className="max-w-3xl mx-auto flex items-center space-x-4">
          <input
            className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-shadow"
            value={input}
            placeholder="Type your message..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            title="Send message"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-3 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
