"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { ChatMessage } from "@/lib/tools";

const STARTER_QUESTIONS = [
  "What does Cadre AI do? Do you work with manufacturing companies?",
  "How do I book a call with an AI strategist?",
  "How do I access the Cadre client portal?",
  "What is the AI Maturity Index and how do I get scored?",
  "How do you choose LLMs, and how do you handle data security?",
];

export default function Chat({ maxMessageChars }: { maxMessageChars: number }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, regenerate, stop } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const bottomRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    sendMessage({ text: trimmed });
    setInput("");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    send(input);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-neutral-500">Ask about Cadre AI&apos;s services, booking a call, or anything else.</p>
            <div className="flex flex-wrap gap-2">
              {STARTER_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => send(question)}
                  className="rounded-full border border-neutral-300 px-3 py-1.5 text-left text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {status === "submitted" && <p className="text-sm text-neutral-500">Thinking…</p>}

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {errorText(error)}{" "}
            <button type="button" onClick={() => regenerate()} className="font-medium underline">
              Retry
            </button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={onSubmit} className="flex gap-2 border-t border-neutral-200 p-4 dark:border-neutral-800">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={maxMessageChars}
          placeholder="Type your question…"
          aria-label="Message"
          className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
        />
        {busy ? (
          <button type="button" onClick={() => stop()} className="rounded-lg border border-neutral-300 px-4 py-2 dark:border-neutral-700">
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-white disabled:opacity-40 dark:bg-white dark:text-neutral-900"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-2xl bg-neutral-900 px-4 py-2 text-white dark:bg-white dark:text-neutral-900"
            : "max-w-[85%] space-y-2 rounded-2xl bg-neutral-100 px-4 py-2 dark:bg-neutral-800"
        }
      >
        {message.parts.map((part, index) => {
          const key = `${message.id}-${index}`;
          switch (part.type) {
            case "text":
              return (
                <p key={key} className="whitespace-pre-wrap">
                  {part.text}
                </p>
              );
            case "tool-get_booking_link":
              if (part.state !== "output-available") return null;
              return (
                <LinkCard
                  key={key}
                  href={part.output.available ? part.output.url : part.output.fallbackUrl}
                  label={part.output.available ? "Book a strategy call" : "Visit cadreai.com"}
                />
              );
            case "tool-escalate_to_human":
              if (part.state === "output-error") {
                return <Notice key={key}>We couldn&apos;t reach the team. Please try again.</Notice>;
              }
              if (part.state !== "output-available") return null;
              return <Notice key={key}>Sent to the Cadre team. They&apos;ll follow up by email.</Notice>;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

function LinkCard({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900"
    >
      {label} →
    </a>
  );
}

function Notice({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-900">
      {children}
    </p>
  );
}

function errorText(error: Error): string {
  try {
    const parsed: unknown = JSON.parse(error.message);
    if (parsed && typeof parsed === "object" && "error" in parsed && typeof parsed.error === "string") {
      return parsed.error;
    }
  } catch {}
  return "Something went wrong.";
}
