"use client";

import Link from "next/link";
import { Gauge, Wifi, TrendingUp } from "lucide-react";

export default function SpeedTestCTA() {
  return (
    <section className="speed-test-cta-section">
      <div className="speed-test-cta-container">
        <div className="speed-test-cta-content">
          <div className="speed-test-cta-icon">
            <Gauge size={48} />
          </div>
          <h2 className="speed-test-cta-title">Test Your Internet Speed</h2>
          <p className="speed-test-cta-description">
            Find out if your internet is performing as it should. Get instant results on your download speed, upload speed, ping, and connection quality.
          </p>
          <div className="speed-test-cta-features">
            <div className="speed-test-cta-feature">
              <Wifi size={20} />
              <span>Real-time Testing</span>
            </div>
            <div className="speed-test-cta-feature">
              <TrendingUp size={20} />
              <span>Instant Results</span>
            </div>
          </div>
          <Link href="/speed-test?autostart=true" className="speed-test-cta-button">
            <Gauge size={20} />
            Run Speed Test
          </Link>
        </div>
      </div>
    </section>
  );
}
