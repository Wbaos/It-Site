import { redirect } from "next/navigation";

// Quote page is temporarily hidden, so this goes straight to the sprinkler
// service page with the short lead form (no chained redirect).
export default function RequestQuoteSchedulePage() {
  redirect("/services/sprinkler-repair-and-installation");
}
