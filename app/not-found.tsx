import Link from "next/link";

// Bilingual 404: Next renders this page for both English and Spanish URLs,
// and it cannot know the visitor's language from a single static route, so
// it shows both languages side by side instead of English only.
export default function NotFound() {
  return (
    <main style={{ textAlign: "center", padding: "10.5rem 1rem 4rem" }}>
      <h1>404</h1>
      <p>This page could not be found.</p>
      <p>Esta página no se pudo encontrar.</p>
      <p>
        <Link href="/">Back to Home</Link>
        {"  •  "}
        <Link href="/es/">Volver al inicio</Link>
      </p>
    </main>
  );
}
