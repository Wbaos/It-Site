export default function HomeVideo({ locale = "en" }: { locale?: "en" | "es" }) {
  const isSpanish = locale === "es";
  return (
    <section className="section home-video" aria-labelledby="home-video-title">
      <div className="site-container">
        <h2 id="home-video-title" className="home-video-heading">
          {isSpanish ? "Mira tu sistema trabajando" : "See your system at work"}
        </h2>
        <p className="home-video-sub">
          {isSpanish
            ? "Sistema de sprinklers optimizado para una cobertura del 100% en Fort Lauderdale."
            : "Optimized sprinkler system for 100% coverage in Fort Lauderdale."}
        </p>
        <div className="home-video-frame">
          <video
            src="https://cdn.sanity.io/files/celkrwoq/production/212bcfac0e81577a37d4c8bbd9f01e9dee1a6997.mp4"
            poster="https://cdn.sanity.io/images/celkrwoq/production/5839c3116edccd85882b50a97612a27ed68bd9f9-1024x768.jpg"
            playsInline
            controls
            preload="none"
          />
        </div>
      </div>
    </section>
  );
}
