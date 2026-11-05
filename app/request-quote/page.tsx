import { redirect } from "next/navigation";

// Quote page temporarily hidden: visitors go to the sprinkler service page
// with the short lead form instead. Temporary (307) on purpose — restore
// the full quote flow below to show this page again.
export default function RequestQuotePage() {
  redirect("/services/sprinkler-repair-and-installation");
}
