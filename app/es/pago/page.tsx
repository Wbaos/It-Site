import CheckoutPage from "@/app/checkout/page";

export const metadata = {
  title: "Pago | CallTechCare",
  description: "Completa tu pago de forma segura.",
  alternates: { canonical: "https://www.calltechcare.com/es/pago" },
};

// Thin Spanish route: CheckoutClient already renders Spanish when the
// pathname starts with /es/, so no duplicated copy lives here.
export default function PagoPage() {
  return <CheckoutPage />;
}
