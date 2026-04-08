"use client";

import { useState, useRef, useEffect } from "react";
import type { Msg } from "@/types/chat";
import ReactMarkdown from "react-markdown";

const INITIAL_MESSAGES: Msg[] = [
    {
        from: "bot",
        text: "Hi! I’m **Sofía** from CallTechCare. What can we help you with today—**sprinkler/irrigation repair**, **security cameras**, or **tech support** (Wi‑Fi, computer, printer, TV, etc.)?",
    },
];

const STORAGE_KEY = "ctc-chat-messages";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [input, setInput] = useState("");
    const [language, setLanguage] = useState<"en" | "es">("en");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [messages, setMessages] = useState<Msg[]>(() => INITIAL_MESSAGES);

    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const requestIdRef = useRef(0);
    const abortRef = useRef<AbortController | null>(null);
    const messagesRef = useRef<Msg[]>(INITIAL_MESSAGES);
    const languageRef = useRef<"en" | "es">("en");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const chatWindowRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll to last message
    useEffect(() => {
        messagesRef.current = messages;
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        languageRef.current = language;
    }, [language]);

    // Focus input on open (helps keyboard behavior on mobile)
    useEffect(() => {
        if (!isOpen) return;
        const el = inputRef.current;
        if (!el) return;
        // Defer focus until after mount/layout
        const id = window.setTimeout(() => {
            try {
                el.focus({ preventScroll: true });
            } catch {
                el.focus();
            }
        }, 0);

        return () => window.clearTimeout(id);
    }, [isOpen]);

    // Abort any in-flight request on unmount
    useEffect(() => {
        return () => {
            abortRef.current?.abort();
            abortRef.current = null;
        };
    }, []);

    // Clear any previously persisted chat (privacy + fresh sessions)
    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
        }
    }, []);

    // Prevent the page behind the chat from scrolling on mobile (helps stop iOS focus-jump).
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (typeof document === "undefined") return;

        const isMobileFullscreen = window.matchMedia?.("(max-width: 600px)")?.matches;
        if (!isOpen || !isMobileFullscreen) return;

        const root = document.documentElement;
        const body = document.body;
        const scrollY = window.scrollY;

        root.classList.add("ctc-chat-open");

        // iOS-safe scroll lock
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";

        return () => {
            root.classList.remove("ctc-chat-open");
            body.style.position = "";
            body.style.top = "";
            body.style.left = "";
            body.style.right = "";
            body.style.width = "";
            window.scrollTo(0, scrollY);
        };
    }, [isOpen]);

    // Expose keyboard height as a CSS variable so the input row can be lifted
    // above the on-screen keyboard (without scrolling the page).
    useEffect(() => {
        if (!isOpen) return;
        if (typeof window === "undefined") return;

        const isMobileFullscreen = window.matchMedia?.("(max-width: 600px)")?.matches;
        if (!isMobileFullscreen) return;

        const el = chatWindowRef.current;
        if (!el) return;

        const vv = window.visualViewport;
        if (!vv) {
            el.style.setProperty("--ctc-kb", "0px");
            return;
        }

        const update = () => {
            const keyboardPx = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
            el.style.setProperty("--ctc-kb", `${keyboardPx}px`);
        };

        update();
        vv.addEventListener("resize", update);
        vv.addEventListener("scroll", update);
        window.addEventListener("orientationchange", update);

        return () => {
            vv.removeEventListener("resize", update);
            vv.removeEventListener("scroll", update);
            window.removeEventListener("orientationchange", update);
            el.style.setProperty("--ctc-kb", "0px");
        };
    }, [isOpen]);

    const resetChat = () => {
        abortRef.current?.abort();
        abortRef.current = null;
        requestIdRef.current += 1; // invalidate any in-flight responses
        setPending(false);
        setInput("");
        setSuggestions([]);
        setLanguage("en");
        setMessages(INITIAL_MESSAGES);
        if (typeof window !== "undefined") {
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch {
            }
        }
    };

    // Send message to API
    const sendMessage = async (rawText?: string) => {
        const text = (rawText ?? input).trim();
        if (!text || pending) return;

        const requestId = (requestIdRef.current += 1);

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const newHistory: Msg[] = [...messagesRef.current, { from: "user", text }];
        setMessages(newHistory);
        setInput("");
        setPending(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal: controller.signal,
                body: JSON.stringify({
                    message: text,
                    history: newHistory,
                }),
            });

            if (!res.ok) throw new Error("Chat API error");
            const data = await res.json();

            if (requestIdRef.current !== requestId) return;

            setLanguage(data.language);
            setSuggestions(data.suggestions || []);

            setMessages((prev) => [...prev, { from: "bot", text: data.reply || "..." }]);
            setPending(false);

            if (data.booking) {
                // Handle booking flow - could redirect to booking page or open modal
                console.log("User wants to book a service!");
                // Example: window.location.href = "/contact";
            }
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                return;
            }
            if (requestIdRef.current !== requestId) return;
            setMessages((prev) => [
                ...prev,
                {
                    from: "bot",
                    text:
                        languageRef.current === "es"
                            ? "Lo siento 😔, hubo un problema. Intenta nuevamente más tarde."
                            : "Sorry 😔, something went wrong. Please try again later.",
                },
            ]);
            setPending(false);
        } finally {
            if (abortRef.current === controller) {
                abortRef.current = null;
            }
        }
    };

    const focusInputWithoutScroll = (e: React.SyntheticEvent) => {
        // On iOS Safari, focusing an input can scroll the viewport, which makes
        // the fullscreen chat appear to jump. We re-focus with preventScroll.
        const isMobileFullscreen =
            typeof window !== "undefined" &&
            window.matchMedia?.("(max-width: 600px)")?.matches;
        if (!isOpen || !isMobileFullscreen) return;

        const el = inputRef.current;
        if (!el) return;

        // Prevent the default focus/scroll behavior.
        // We then focus manually with preventScroll when supported.
        if ("preventDefault" in e) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (e as any).preventDefault?.();
        }

        try {
            el.focus({ preventScroll: true });
        } catch {
            el.focus();
        }
    };

    return (
        <div className="ctc-chat-wrapper">
            {/* Floating chat button - always mounted */}
            <button
                className="ctc-chat-bubbleButton"
                onClick={() => setIsOpen((v) => !v)}
                aria-label={isOpen ? "Close chat support" : "Open chat support"}
                style={{ zIndex: isOpen ? 9998 : 9999 }}
            >
                💬
            </button>

            {/* Chat window - toggled only */}
            {isOpen && (
                <div className="ctc-chat-window" ref={chatWindowRef}>
                    {/* Header */}
                    <header className="ctc-chat-header">
                        <div className="ctc-chat-header-name">
                            <span className="dot-online" />
                            <span>Sofía – CallTechCare Assistant</span>
                        </div>
                        <div className="ctc-chat-header-actions">
                            <button
                                className="ctc-chat-reset"
                                type="button"
                                onClick={resetChat}
                                aria-label="Start a new chat"
                                title="Start over"
                            >
                                New
                            </button>
                            <button
                                className="ctc-chat-close"
                                onClick={() => {
                                    abortRef.current?.abort();
                                    abortRef.current = null;
                                    setPending(false);
                                    setIsOpen(false);
                                }}
                                aria-label="Close chat"
                                type="button"
                            >
                                ✕
                            </button>
                        </div>
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
                                    onClick={() => {
                                        // Handle special actions
                                        if (suggestion.includes("Speed Test") || suggestion.includes("velocidad")) {
                                            window.location.href = "/speed-test";
                                            return;
                                        }
                                        if (suggestion.includes("Contact") || suggestion.includes("soporte")) {
                                            window.location.href = "/contact";
                                            return;
                                        }
                                        if (suggestion.includes("services") || suggestion.includes("servicios")) {
                                            window.location.href = "/services";
                                            return;
                                        }

                                        // Default: send as message
                                        void sendMessage(suggestion);
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
                            ref={inputRef}
                            placeholder={
                                language === "es"
                                    ? "Describe tu problema…"
                                    : "Describe your issue…"
                            }
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onPointerDown={focusInputWithoutScroll}
                            onTouchStart={focusInputWithoutScroll}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                            className="ctc-chat-sendBtn"
                            onClick={() => {
                                void sendMessage();
                            }}
                            disabled={pending || !input.trim()}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
