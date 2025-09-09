import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { homeSections } from "@/lib/pageSections";

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        {homeSections.map(({ key, Component, props }) => (
          <Component key={key} {...(props ?? {})} />
        ))}
      </main>
      <Footer />
    </>
  );
}
