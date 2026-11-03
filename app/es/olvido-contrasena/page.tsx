import ForgotPasswordPage from "@/app/forgot-password/page";

export const metadata = {
  title: "Olvidé mi Contraseña | CallTechCare",
  description: "Recibe un enlace para restablecer tu contraseña.",
  alternates: { canonical: "https://www.calltechcare.com/es/olvido-contrasena" },
};

// Thin Spanish route: the forgot-password component already renders Spanish
// when the pathname starts with /es/, so no duplicated copy lives here.
export default function OlvidoContrasenaPage() {
  return <ForgotPasswordPage />;
}
