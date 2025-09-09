import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareTech — Senior IT Help",
  description: "Patient, friendly tech support for seniors in Miami.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased text-gray-900">{children}</body>
    </html>
  );
}
