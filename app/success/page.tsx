import { Suspense } from "react";
import SuccessPageClient from "./SuccessPageClient";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="success-page">
          <div className="site-container">
            <section className="success-card" aria-busy="true">
              <p className="success-message">Loading…</p>
            </section>
          </div>
        </main>
      }
    >
      <SuccessPageClient />
    </Suspense>
  );
}