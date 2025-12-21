import { NextResponse } from "next/server";
import OpenAI from "openai";
import { sanity } from "@/lib/sanity";
import type { Msg } from "@/types/chat";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

interface FAQ {
    question?: string;
    answer?: string;
}

interface Service {
    title: string;
    slug?: { current?: string };
    price?: number;
    shortDescription?: string;
    faqs?: FAQ[] | null;
}

// Cache for services and homepage (5 minute duration)
let cachedServices: Service[] | null = null;
let cachedHomepage: string | null = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function POST(req: Request) {
    let detectedLang = "en"; // Track language throughout the request
    
    try {
        const { message, history } = await req.json();

        // Limit conversation history to prevent token overflow
        const recentHistory = Array.isArray(history) ? history.slice(-10) : [];

        // Check cache validity
        const now = Date.now();
        const isCacheValid = cachedServices && cachedHomepage && (now - cacheTime) < CACHE_DURATION;

        // Fetch or use cached data
        if (!isCacheValid) {
            cachedServices = await sanity.fetch(`*[_type=="service"]{
        title,
        slug,
        price,
        shortDescription,
        faqs[]->{question, answer}
      }`);
            const homepageRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}`);
            cachedHomepage = await homepageRes.text();
            cacheTime = now;
        }

        const services = cachedServices!;
        const homepageText = cachedHomepage!;

        //  Detect language
        const langDetect = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Detect language: respond only 'en' or 'es'." },
                { role: "user", content: message },
            ],
        });
        detectedLang = langDetect.choices[0].message.content?.trim() || "en";
        const lang = detectedLang === "es" ? "es" : "en";

        //  Safely build the service info block
        const serviceInfo = services
            .map((s) => {
                const faqsArray = Array.isArray(s.faqs) ? s.faqs : [];
                const cleanFaqs = faqsArray
                    .filter((f) => f && typeof f === "object")
                    .map((f) => {
                        const q = (f.question || "").trim();
                        const a = (f.answer || "").trim();
                        return q && a ? `Q: ${q}\nA: ${a}` : "";
                    })
                    .filter(Boolean)
                    .join("\n");

                const faqSection = cleanFaqs ? `FAQs:\n${cleanFaqs}\n` : "";

                return `• ${s.title} — $${s.price || "?"}
${s.shortDescription || ""}
${faqSection}URL: ${process.env.NEXT_PUBLIC_BASE_URL}/services/${s.slug?.current || ""}
`;
            })
            .join("\n");

        //  Build global context
        const knowledgeContext = `
You are Sofía, CallTechCare's friendly and intelligent virtual assistant.
Use the following company and service information to answer clearly and conversationally.

--- COMPANY INFO ---
${homepageText.slice(0, 7000)}

--- SERVICES (from CMS) ---
${serviceInfo}

Guidelines:
- Always answer in the same language as the user (you speak both English and Spanish fluently).
- Be warm and conversational - acknowledge questions about your capabilities, greet users naturally, and build rapport.
- For service questions: Format services as a clean list with each service on a new line. Use this format:
  • **Service Name** — **$Price**
  Description here
  [View Service](URL)
  
- When listing multiple services, separate them clearly with line breaks.
- For questions about your abilities (e.g., "Do you speak Spanish?"): Answer directly and positively, then offer to help with services.
- For general questions (coverage area, business hours, contact info): Answer using the company info provided.
- For completely unrelated topics (weather, recipes, sports): Politely redirect to CallTechCare services but remain friendly.
- Never ask for personal data like full names, addresses, or payment information - that's handled securely during booking.
- Use emojis occasionally to be friendly, but don't overuse them.
- Make links clickable using markdown format: [Link Text](URL)
`;

        // Build proper message array for OpenAI
        const conversationMessages = [
            { role: "system" as const, content: knowledgeContext },
            ...recentHistory.map((h: Msg) => ({
                role: (h.from === "user" ? "user" : "assistant") as "user" | "assistant",
                content: h.text,
            })),
            { role: "user" as const, content: message },
        ];

        //  Generate AI response
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.5,
            messages: conversationMessages,
        });

        const aiReply = response.choices[0].message.content?.trim() || "...";

        // Detect booking intent
        const bookingKeywords = /\b(book|schedule|appointment|reserve|set up|install|agendar|reservar|programar|cita)\b/i;
        const wantsToBook = bookingKeywords.test(message) || bookingKeywords.test(aiReply);

        // Generate contextual quick reply suggestions
        const suggestions = lang === "es"
            ? ["📋 Ver todos los servicios", "⚡ Prueba de velocidad", "💬 Hablar con soporte"]
            : ["📋 View all services", "⚡ Speed Test", "💬 Contact support"];

        return NextResponse.json({
            reply: aiReply,
            language: lang,
            booking: wantsToBook,
            suggestions,
        });
    } catch (err) {
        console.error("Error in /api/chat:", err);
        
        // Detect error type for better user feedback
        const isRateLimit = err instanceof Error && err.message.includes('rate_limit');
        const isNetworkError = err instanceof Error && (err.message.includes('fetch') || err.message.includes('network'));
        
        // Use the detected language from the request (default to English if detection failed)
        const lang = detectedLang;
        const isSpanish = lang === "es";
        
        let errorMsg = "Sorry 😔, something went wrong while processing your request. Please try again later or contact support@calltechcare.com.";
        
        if (isSpanish) {
            if (isRateLimit) {
                errorMsg = "Demasiadas solicitudes 😔. Por favor espera un momento e intenta nuevamente.";
            } else if (isNetworkError) {
                errorMsg = "Problema de conexión 😔. Por favor verifica tu internet e intenta nuevamente.";
            } else {
                errorMsg = "Lo siento 😔, hubo un problema al procesar tu solicitud. Intenta nuevamente más tarde o contacta support@calltechcare.com.";
            }
        } else {
            if (isRateLimit) {
                errorMsg = "Too many requests 😔. Please wait a moment and try again.";
            } else if (isNetworkError) {
                errorMsg = "Connection problem 😔. Please check your internet and try again.";
            }
        }
        
        return NextResponse.json(
            { reply: errorMsg },
            { status: 500 }
        );
    }
}
