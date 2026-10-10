
"use client";

import { useState } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);

  function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const text = message.trim();
    if (!text) return;

    setMessages((previous) => [
      ...previous,
      { text, sender: "user" },
    ]);

    setMessage("");
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {isOpen && (
        <section className="mb-4 flex h-[460px] w-[350px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-2xl shadow-blue-950/15">
          {/* Header */}
          <header className="flex items-center justify-between bg-gradient-to-r from-blue-700 to-blue-500 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-2xl">
                ♡
              </div>
              <div>
                <h2 className="font-semibold">MediSync Assistant</h2>
                <p className="mt-1 text-xs text-blue-100">
                  Healthcare support
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
              className="rounded-lg px-3 py-1 text-2xl transition hover:bg-white/20"
            >
              ×
            </button>
          </header>

          {/* Chat messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
            <p className="text-center text-[10px] font-semibold tracking-widest text-slate-400">
              MEDISYNC SUPPORT
            </p>

            <div className="flex items-start gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-700">
                ♡
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-blue-100 bg-white p-3 text-sm leading-6 text-slate-700 shadow-sm">
                <p className="mb-1 font-semibold text-blue-700">
                  Hello! Welcome to MediSync 👋
                </p>
                How can I help you today?
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setMessage("How do I use MediSync?")
                    }
                    className="rounded-full border border-blue-200 px-3 py-1.5 text-xs text-blue-700 transition hover:bg-blue-50"
                  >
                    Using MediSync
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setMessage("Where can I find health records?")
                    }
                    className="rounded-full border border-blue-200 px-3 py-1.5 text-xs text-blue-700 transition hover:bg-blue-50"
                  >
                    Health records
                  </button>
                </div>
              </div>
            </div>

            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <p
                  className={`max-w-[85%] break-words rounded-2xl p-3 text-sm ${
                    item.sender === "user"
                      ? "rounded-tr-sm bg-blue-600 text-white"
                      : "rounded-tl-sm border bg-white text-slate-700"
                  }`}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Message input */}
          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 border-t border-slate-100 bg-white p-3"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              aria-label="Type your message"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 active:scale-95"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path
                  d="M22 2 11 13"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="m22 2-7 20-4-9-9-4 20-7Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>

          <p className="bg-white pb-2 text-center text-[10px] text-slate-400">
            MediSync · Healthcare information assistant
          </p>
        </section>
      )}

      {/* Floating button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Close assistant" : "Open assistant"}
          className="group flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-xl shadow-blue-900/25 transition duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          {isOpen ? (
            <span className="text-3xl">×</span>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-7 w-7 transition-transform duration-300 group-hover:scale-110"
            >
              <path
                d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
