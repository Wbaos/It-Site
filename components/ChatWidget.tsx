"use client";

import { useState, useRef, useEffect } from "react";
import type { Msg } from "@/types/chat";
import ReactMarkdown from "react-markdown";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [input, setInput] = useState("");
    const [language, setLanguage] = useState<"en" | "es">("en");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [messages, setMessages] = useState<Msg[]>(() => {
        // Load messages from localStorage
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("ctc-chat-messages");
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error("Failed to parse saved messages");
                }
            }
        }
        return [
            {
                from: "bot",
                text: "Hi 👋 I'm **Sofía** from CallTechCare. Which device do you need help with today? (computer, printer, Wi-Fi, TV, etc.)",
            },
        ];
    });

    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll to last message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Save messages to localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("ctc-chat-messages", JSON.stringify(messages));
        }
    }, [messages]);

    // Send message to API
    const sendMessage = async () => {
        if (!input.trim() || pending) return;

        const newMessages: Msg[] = [...messages, { from: "user", text: input }];
        const userInput = input;
        setMessages(newMessages);
        setInput("");
        setPending(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userInput,
                    history: newMessages,
                }),
            });

            if (!res.ok) throw new Error("Chat API error");
            const data = await res.json();

            setLanguage(data.language);
            setSuggestions(data.suggestions || []);

            setMessages((prev) => [
                ...prev,
                { from: "bot", text: data.reply || "..." },
            ]);

            setPending(false);

            if (data.booking) {
                // Handle booking flow - could redirect to booking page or open modal
                console.log("User wants to book a service!");
                // Example: window.location.href = "/contact";
            }
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    from: "bot",
                    text:
                        language === "es"
                            ? "Lo siento 😔, hubo un problema. Intenta nuevamente más tarde."
                            : "Sorry 😔, something went wrong. Please try again later.",
                },
            ]);
            setPending(false);
        }
    };

    return (
        <div className="ctc-chat-wrapper">
            {/* Floating chat button */}
            <button
                className="ctc-chat-bubbleButton"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open chat support"
            >
                💬
            </button>

            {/* Chat window */}
            {isOpen && (
                <div className="ctc-chat-window">
                    {/* Header */}
                    <header className="ctc-chat-header">
                        <div className="ctc-chat-header-name">
                            <span className="dot-online" />
                            <span>Sofía – CallTechCare Assistant</span>
                        </div>
                        <button
                            className="ctc-chat-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                        >
                            ✕
                        </button>
                    </header>

                    {/* Messages */}
                    <div className="ctc-chat-messages">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`ctc-chat-msg ${m.from === "user" ? "from-user" : "from-bot"}`}
                            >
                                <ReactMarkdown
                                    components={{
                                        a: (props) => (
                                            <a
                                                {...props}
                                                className="chat-link"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            />
                                        ),
                                        strong: (props) => (
                                            <strong className="chat-strong">{props.children}</strong>
                                        ),
                                    }}
                                >
                                    {m.text}
                                </ReactMarkdown>
                            </div>
                        ))}

                        {pending && (
                            <div className="ctc-chat-msg from-bot">
                                <div className="ctc-chat-typing-indicator">
                                    <span className="ctc-chat-typing-dot"></span>
                                    <span className="ctc-chat-typing-dot"></span>
                                    <span className="ctc-chat-typing-dot"></span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Quick Reply Suggestions */}
                    {suggestions.length > 0 && !pending && (
                        <div className="ctc-chat-suggestions">
                            {suggestions.map((suggestion, i) => (
                                <button
                                    key={i}
                                    className="ctc-chat-suggestion-btn"
                                    onClick={async () => {
                                        setInput(suggestion);
                                        // Wait for state to update, then send
                                        setTimeout(() => {
                                            const btn = document.querySelector('.ctc-chat-sendBtn') as HTMLButtonElement;
                                            btn?.click();
                                        }, 50);
                                    }}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="ctc-chat-inputRow">
                        <input
                            className="ctc-chat-input"
                            placeholder={
                                language === "es"
                                    ? "Describe tu problema…"
                                    : "Describe your issue…"
                            }
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                            className="ctc-chat-sendBtn"
                            onClick={sendMessage}
                            disabled={pending}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
