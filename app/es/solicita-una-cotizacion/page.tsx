import { redirect } from "next/navigation";

// Quote page temporarily hidden: visitors go to the Spanish sprinkler
// service page with the short lead form instead. Temporary (307) on
// purpose — restore the full quote flow below to show this page again.
export default function SolicitaUnaCotizacionPage() {
  redirect("/es/reparacion-e-instalacion-de-sprinklers");
}
