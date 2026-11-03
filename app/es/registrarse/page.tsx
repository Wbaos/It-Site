import SignUpPage from "@/app/signup/page";

export const metadata = {
  title: "Crear Cuenta | CallTechCare",
  description: "Crea tu cuenta de CallTechCare.",
  alternates: { canonical: "https://www.calltechcare.com/es/registrarse" },
};

// Thin Spanish route: the signup component already renders Spanish when the
// pathname starts with /es/, so no duplicated copy lives here.
export default function RegistrarsePage() {
  return <SignUpPage />;
}
