import HighlightsClient from "./Highlights";
import { getHighlights } from "@/lib/getHighLights";

export default async function HighlightsServer({ locale = "en" }: { locale?: "en" | "es" }) {
  const highlights = await getHighlights(locale); 
  return <HighlightsClient highlights={highlights} />;
}
