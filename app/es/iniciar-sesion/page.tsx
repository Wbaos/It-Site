import LoginPage from "@/app/login/page";

export const metadata = {
  title: "Iniciar Sesión | CallTechCare",
  description: "Inicia sesión en tu cuenta de CallTechCare.",
  alternates: { canonical: "https://www.calltechcare.com/es/iniciar-sesion" },
};

// Thin Spanish route: the login component already renders Spanish when the
// pathname starts with /es/, so no duplicated copy lives here.
export default function IniciarSesionPage() {
  return <LoginPage />;
}
