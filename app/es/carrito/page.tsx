import CartPage from "@/app/cart/page";

export const metadata = {
  title: "Carrito de Compras | CallTechCare",
  description: "Revisa tus artículos antes de pagar.",
  alternates: { canonical: "https://www.calltechcare.com/es/carrito" },
};

// Thin Spanish route: the cart component already renders Spanish when the
// pathname starts with /es/, so no duplicated copy lives here.
export default function CarritoPage() {
  return <CartPage />;
}
