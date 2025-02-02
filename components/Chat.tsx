"use client";

import React from "react";
import { useChat } from "ai/react";
import { Send, Bot, User } from "lucide-react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-zinc-900">
      {/* Header */}
      <header className="py-4 px-6 bg-white dark:bg-zinc-800 border-b dark:border-zinc-700 shadow-sm">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-500" /> Watashi AI
        </h1>
      </header>

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-2xl mx-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role !== "user" && (
              <Bot className="w-6 h-6 text-blue-500 mr-2" />
            )}
            <div
              className={`px-4 py-3 rounded-lg shadow-sm max-w-[80%] text-sm ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
              }`}
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <User className="w-6 h-6 text-blue-600 ml-2" />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Box */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white dark:bg-zinc-800 border-t dark:border-zinc-700"
      >
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <input
            className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={input}
            placeholder="Ask me anything..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            title="Send message"
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
