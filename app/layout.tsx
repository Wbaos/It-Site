import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export const metadata = {
  title: "CareTech",
  description: "Friendly tech help for seniors",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Navbar />

        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
