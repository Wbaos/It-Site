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

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();

        //  Fetch services (with FAQs)
        const services: Service[] = await sanity.fetch(`*[_type=="service"]{
      title,
      slug,
      price,
      shortDescription,
      faqs[]->{question, answer}
    }`);

        //  Load homepage HTML
        const homepageRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}`);
        const homepageText = await homepageRes.text();

        //  Detect language
        const langDetect = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Detect language: respond only 'en' or 'es'." },
                { role: "user", content: message },
            ],
        });
        const detectedLang = langDetect.choices[0].message.content?.trim() || "en";
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
You are Sofía, TechCare’s intelligent virtual assistant.
Use the following company and service information to answer clearly and conversationally.

--- COMPANY INFO ---
${homepageText.slice(0, 7000)}

--- SERVICES (from CMS) ---
${serviceInfo}

Guidelines:
- Always answer in the same language as the user.
- Include the matching service’s description, price, and clickable URL.
- If FAQs exist, include the most relevant one(s).
- For general questions (coverage, about, prices), summarize from context.
- If question is unrelated (e.g. weather, cooking), politely say you only assist with TechCare topics.
- Never ask for names or personal data.
`;

        //  Combine conversation history
        const convoText = [
            ...history.map((h: Msg) => `${h.from}: ${h.text}`),
            `user: ${message}`,
        ].join("\n");

        //  Generate AI response
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.5,
            messages: [
                { role: "system", content: knowledgeContext },
                { role: "user", content: convoText },
            ],
        });

        const aiReply = response.choices[0].message.content?.trim() || "...";

        return NextResponse.json({
            reply: aiReply,
            language: lang,
        });
    } catch (err) {
        console.error("Error in /api/chat:", err);
        return NextResponse.json(
            {
                reply:
                    "Sorry 😔, something went wrong while processing your request. Please try again later or contact support@calltechcare.com.",
            },
            { status: 500 }
        );
    }
}
