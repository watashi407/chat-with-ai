"use client";

import React, { useState } from "react";
import { useChat } from "ai/react";
import { Send, Bot, User, Clipboard, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ThemeSelect } from "@/components/theme/Toggle-theme";

type MessageType = {
  id: string;
  role: "user" | "assistant" | "system" | "data"; // Include system and data
  content: string;
};

// Message component with copy functionality for AI responses only
const Message = ({ message }: { message: MessageType }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const codeBlockRegex = /```(\w+)?\n([\s\S]+?)```/; // Detects code blocks
  const match = message.content.match(codeBlockRegex);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <Bot className="w-6 h-6 text-blue-500 mr-2" />}

      <div className="relative px-4 py-3 rounded-lg shadow-sm max-w-[80%] text-sm bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100">
        {/* Copy Button (Only for AI messages) */}
        {!isUser && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 transition"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Clipboard className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        )}

        {/* Render Code with Syntax Highlighting */}
        {match ? (
          <SyntaxHighlighter
            language={match[1] || "tsx"}
            style={solarizedlight}
          >
            {match[2].trim()}
          </SyntaxHighlighter>
        ) : (
          <p>{message.content}</p>
        )}
      </div>

      {isUser && <User className="w-6 h-6 text-blue-600 ml-2" />}
    </div>
  );
};

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-zinc-900">
      {/* Header */}
      <header className="py-4 px-6 bg-white dark:bg-zinc-800 border-b dark:border-zinc-700 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Watashi AI
          </h1>
        </div>

        <div className="flex items-center gap-4 ">
          {/* Add other right-side icons here if needed */}
          <ThemeSelect />
        </div>
      </header>

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-2xl mx-auto">
        {messages
          .filter((m) => m.role === "user" || m.role === "assistant") // Only include allowed roles
          .map((m) => (
            <Message key={m.id} message={m} />
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
