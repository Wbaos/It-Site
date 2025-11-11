import HighlightsClient from "./Highlights";
import { getHighlights } from "@/lib/getHighLights";

export default async function HighlightsServer() {
  const highlights = await getHighlights(); 
  return <HighlightsClient highlights={highlights} />;
}
