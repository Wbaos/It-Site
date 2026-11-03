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
            ? "Sprinklers regando un jardín delantero en Miami, como los que instalamos y reparamos a domicilio."
            : "Sprinklers watering a front yard in Miami, like the ones we install and repair on site."}
        </p>
        <div className="home-video-frame">
          <video
            src="https://cdn.sanity.io/files/celkrwoq/production/6796625dc809d99fad0e95f1a9a18114b4d0b4e7.mp4"
            poster="https://cdn.sanity.io/images/celkrwoq/production/5839c3116edccd85882b50a97612a27ed68bd9f9-1024x768.jpg"
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
          />
        </div>
      </div>
    </section>
  );
}
