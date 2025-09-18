import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/CartContext";
import { NavProvider } from "@/lib/NavContext";

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
        <CartProvider>
          <NavProvider>
            {" "}
            <Navbar />
            <main className="main-content">{children}</main>
            <Footer />
          </NavProvider>
        </CartProvider>
      </body>
    </html>
  );
}
