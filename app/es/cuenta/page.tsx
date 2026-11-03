import AccountPage from "@/app/account/page";

export const metadata = {
  title: "Mi Cuenta | CallTechCare",
  description: "Tus pedidos y tu perfil en CallTechCare.",
  alternates: { canonical: "https://www.calltechcare.com/es/cuenta" },
};

// Thin Spanish route: the account component already renders Spanish when the
// pathname starts with /es/, so no duplicated copy lives here. Protection
// for this route lives in middleware.ts, same as /account.
export default function CuentaPage() {
  return <AccountPage />;
}
