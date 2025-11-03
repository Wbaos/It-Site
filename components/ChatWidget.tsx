"use client";

import { useState, useRef, useEffect } from "react";
import type { Msg } from "@/types/chat";
import ReactMarkdown from "react-markdown";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [input, setInput] = useState("");
    const [language, setLanguage] = useState<"en" | "es">("en");
    const [messages, setMessages] = useState<Msg[]>([
        {
            from: "bot",
            text: "Hi 👋 I'm **Sofía** from CallTechCare. Which device do you need help with today? (computer, printer, Wi-Fi, TV, etc.)",
        },
    ]);

    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll to last message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

            setMessages((prev) => [
                ...prev,
                { from: "bot", text: data.reply || "..." },
            ]);

            setPending(false);

            if (data.booking) {
                console.log("🟢 Booking intent detected. Awaiting payment confirmation...");
            }
        } catch (error) {
            console.error(error);
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
                                {language === "es" ? "Escribiendo…" : "Typing…"}
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

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
