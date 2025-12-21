"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Wifi, Download, Upload, Activity, Zap, CheckCircle, Info } from "lucide-react";

interface SpeedTestResult {
    downloadSpeed: number;
    uploadSpeed: number;
    ping: number;
    jitter: number;
}

function SpeedTestContent() {
    const searchParams = useSearchParams();
    const autostart = searchParams.get('autostart') === 'true';
    const [testing, setTesting] = useState(autostart);
    const [progress, setProgress] = useState(0);
    const [currentTest, setCurrentTest] = useState<"ping" | "download" | "upload" | "complete">("ping");
    const [results, setResults] = useState<SpeedTestResult | null>(null);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    useEffect(() => {
        if (autostart && !results) {
            runSpeedTest();
        }
    }, []);

    const runSpeedTest = async () => {
        setTesting(true);
        setProgress(0);
        setResults(null);

        // Start smooth continuous progress animation
        const totalDuration = 23000; // 23 seconds total
        const startTime = Date.now();
        let animationFrame: number;

        const animateProgress = () => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
            setProgress(Math.floor(newProgress));

            if (newProgress < 100) {
                animationFrame = requestAnimationFrame(animateProgress);
            }
        };

        animationFrame = requestAnimationFrame(animateProgress);

        try {
            // Run all tests in sequence while progress animates
            setCurrentTest("ping");
            const { ping, jitter } = await testPingWithJitter();

            setCurrentTest("download");
            const downloadSpeed = await testDownloadSpeed();

            setCurrentTest("upload");
            const uploadSpeed = await testUploadSpeed();

            // Wait for animation to complete if tests finish early
            const elapsed = Date.now() - startTime;
            if (elapsed < totalDuration) {
                await new Promise(resolve => setTimeout(resolve, totalDuration - elapsed));
            }

            cancelAnimationFrame(animationFrame);
            setProgress(100);
            setCurrentTest("complete");
            setResults({ downloadSpeed, uploadSpeed, ping, jitter });
        } catch (error) {
            console.error("Speed test error:", error);
            cancelAnimationFrame(animationFrame);
        } finally {
            setTesting(false);
        }
    };

    const testPingWithJitter = async (): Promise<{ ping: number; jitter: number }> => {
        const iterations = 5;
        const pings: number[] = [];

        for (let i = 0; i < iterations; i++) {
            const startTime = performance.now();
            try {
                await fetch("/api/ping?t=" + Date.now(), { method: "HEAD" });
                const endTime = performance.now();
                pings.push(endTime - startTime);
            } catch {
                pings.push(100);
            }
        }

        const avgPing = pings.reduce((a, b) => a + b, 0) / pings.length;
        const variance = pings.reduce((sum, ping) => sum + Math.pow(ping - avgPing, 2), 0) / pings.length;
        const jitter = Math.sqrt(variance);

        return {
            ping: Math.round(avgPing),
            jitter: Math.round(jitter)
        };
    };

    const testDownloadSpeed = async (): Promise<number> => {
        const testDuration = 10000;
        const chunkSize = 10000000;
        const numStreams = 6;
        let totalBytes = 0;

        const startTime = performance.now();

        const downloadStream = async () => {
            while (performance.now() - startTime < testDuration) {
                try {
                    const response = await fetch(
                        `https://speed.cloudflare.com/__down?bytes=${chunkSize}`,
                        { cache: 'no-store' }
                    );
                    const blob = await response.blob();
                    totalBytes += blob.size;
                } catch (error) {
                    break;
                }
            }
        };

        const streams = Array(numStreams).fill(null).map(() => downloadStream());
        await Promise.all(streams);

        const duration = (performance.now() - startTime) / 1000;
        const speedMbps = (totalBytes * 8) / (duration * 1000000);

        return Math.round(speedMbps * 10) / 10;
    };

    const testUploadSpeed = async (): Promise<number> => {
        const testDuration = 10000;
        const chunkSize = 1000000;
        const numStreams = 6;
        let totalBytes = 0;

        const startTime = performance.now();
        const data = new ArrayBuffer(chunkSize);

        const uploadStream = async () => {
            while (performance.now() - startTime < testDuration) {
                try {
                    await fetch('https://speed.cloudflare.com/__up', {
                        method: 'POST',
                        body: data,
                        cache: 'no-store'
                    });
                    totalBytes += chunkSize;
                } catch (error) {
                    break;
                }
            }
        };

        const streams = Array(numStreams).fill(null).map(() => uploadStream());
        await Promise.all(streams);

        const duration = (performance.now() - startTime) / 1000;
        const speedMbps = (totalBytes * 8) / (duration * 1000000);

        return Math.round(speedMbps * 10) / 10;
    };

    const getSpeedRating = (speed: number) => {
        if (speed < 5) return { text: "Poor", color: "#ef4444" };
        if (speed < 25) return { text: "Fair", color: "#f59e0b" };
        if (speed < 100) return { text: "Good", color: "#3b82f6" };
        return { text: "Excellent", color: "#10b981" };
    };

    const getPingRating = (ping: number) => {
        if (ping < 20) return { text: "Excellent", color: "#10b981" };
        if (ping < 50) return { text: "Good", color: "#3b82f6" };
        if (ping < 100) return { text: "Fair", color: "#f59e0b" };
        return { text: "Poor", color: "#ef4444" };
    };

    const getJitterRating = (jitter: number) => {
        if (jitter < 5) return { text: "Excellent", color: "#10b981" };
        if (jitter < 10) return { text: "Good", color: "#3b82f6" };
        if (jitter < 20) return { text: "Fair", color: "#f59e0b" };
        return { text: "Poor", color: "#ef4444" };
    };

    const getRecommendation = () => {
        if (!results) return null;
        const { downloadSpeed, uploadSpeed, ping, jitter } = results;

        if (downloadSpeed < 25 || uploadSpeed < 3 || ping > 100) {
            return {
                title: "Connection Needs Improvement",
                message: "Your internet connection may benefit from optimization. Contact CallTechCare for professional WiFi optimization services."
            };
        }
        if (downloadSpeed < 100 || uploadSpeed < 10 || ping > 50 || jitter > 20) {
            const issues = [];
            if (downloadSpeed < 100) issues.push("download speeds");
            if (uploadSpeed < 10) issues.push("upload speeds");
            if (ping > 50) issues.push("latency");
            if (jitter > 20) issues.push("connection stability");
            
            return {
                title: "Good Connection",
                message: `Your internet is working well${issues.length > 0 ? `, but ${issues.join(", ")} could be improved` : ""}. We can help optimize your network for better performance.`
            };
        }
        return {
            title: "Excellent Connection!",
            message: "Your internet connection is performing excellently. Perfect for streaming, video calls, and most online activities."
        };
    };

    const getTooltipInfo = (type: string) => {
        switch (type) {
            case "download":
                return {
                    title: "Download Speed",
                    description: "How fast data arrives to your device from the internet. Critical for streaming videos, downloading files, and loading web pages.",
                    ideal: "100+ Mbps for 4K streaming and multiple devices"
                };
            case "upload":
                return {
                    title: "Upload Speed",
                    description: "How fast data travels from your device to the internet. Important for video calls, live streaming, and uploading files.",
                    ideal: "10+ Mbps for smooth video conferencing"
                };
            case "ping":
                return {
                    title: "Ping (Latency)",
                    description: "The response time between your device and the server. Lower is better for real-time activities like gaming and video calls.",
                    ideal: "Under 50ms for optimal gaming performance"
                };
            case "jitter":
                return {
                    title: "Jitter",
                    description: "The variation in ping over time. Consistent low jitter ensures stable connections for voice/video calls and online gaming.",
                    ideal: "Under 10ms for consistent performance"
                };
            default:
                return null;
        }
    };

    const canDo = (activity: string, required: number) => {
        if (!results) return false;
        const { downloadSpeed, ping } = results;

        switch (activity) {
            case "HD Video Streaming":
                return downloadSpeed >= 5;
            case "4K Video Streaming":
                return downloadSpeed >= 25;
            case "Video Calls":
                return downloadSpeed >= 3 && ping < 100;
            case "Online Gaming":
                return downloadSpeed >= 10 && ping < 50;
            default:
                return false;
        }
    };

    const getTestLabel = () => {
        switch (currentTest) {
            case "ping": return "Testing Connection...";
            case "download": return "Testing Download Speed...";
            case "upload": return "Testing Upload Speed...";
            default: return "";
        }
    };

    return (
        <div className="speed-test-page-new">
            <div className="speed-test-container-new">
                {/* Header */}
                <div className="test-header">
                    <div className="wifi-icon">
                        <Wifi size={48} />
                    </div>
                    <h1 className="test-title">Internet Speed Test</h1>
                    <p className="test-subtitle">Test your connection speed and get recommendations</p>
                </div>

                {/* Testing State */}
                {testing && (
                    <div className="test-card">
                        <div className="progress-circle">
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="var(--brand-teal)"
                                    strokeWidth="8"
                                    strokeDasharray={`${progress * 2.827} 283`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--brand-teal)', lineHeight: '1' }}>
                                    {Math.floor(progress)}%
                                </div>
                                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                                    Testing
                                </div>
                            </div>
                        </div>
                        <h2 className="test-status">{getTestLabel()}</h2>
                        <p className="test-wait">Please wait while we test your connection...</p>

                        <div className="live-stats">
                            <div className="stat-card">
                                <Download size={20} color="var(--brand-teal)" />
                                <div className="stat-value">{results?.downloadSpeed || "0.0"}</div>
                                <div className="stat-label">Mbps Down</div>
                            </div>
                            <div className="stat-card">
                                <Upload size={20} color="#3b82f6" />
                                <div className="stat-value">{results?.uploadSpeed || "0.0"}</div>
                                <div className="stat-label">Mbps Up</div>
                            </div>
                            <div className="stat-card">
                                <Activity size={20} color="#f59e0b" />
                                <div className="stat-value">{results?.ping || "0"}</div>
                                <div className="stat-label">ms Ping</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Initial State */}
                {!testing && !results && (
                    <div className="test-card">
                        <button className="start-test-btn" onClick={runSpeedTest}>
                            <Zap size={20} />
                            Start Speed Test
                        </button>
                        <p className="test-note">The test will measure your download speed, upload speed, and ping</p>
                    </div>
                )}

                {/* Results */}
                {!testing && results && (
                    <>
                        <div className="results-header">
                            <h2>Test Results</h2>
                            <button className="test-again-btn" onClick={runSpeedTest}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                                </svg>
                                Test Again
                            </button>
                        </div>

                        <div className="results-grid">
                            <div 
                                className="result-card"
                                onMouseEnter={() => setHoveredCard("download")}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <button 
                                    className="speed-test-info-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setHoveredCard(hoveredCard === 'download' ? null : 'download');
                                    }}
                                    aria-label="Show download speed information"
                                >
                                    <Info size={18} />
                                </button>
                                <div className="result-icon download-icon">
                                    <Download size={24} />
                                </div>
                                <div className="result-content">
                                    <div className="result-label">Download Speed</div>
                                    <div className="result-value">{results.downloadSpeed} <span>Mbps</span></div>
                                    <div className="result-rating" style={{ color: getSpeedRating(results.downloadSpeed).color }}>
                                        {getSpeedRating(results.downloadSpeed).text}
                                    </div>
                                </div>
                                <CheckCircle size={24} color={getSpeedRating(results.downloadSpeed).color} className="check-icon" />
                                {hoveredCard === "download" && (
                                    <div className="metric-tooltip">
                                        <div className="tooltip-title">{getTooltipInfo("download")?.title}</div>
                                        <div className="tooltip-description">{getTooltipInfo("download")?.description}</div>
                                        <div className="tooltip-ideal">💡 {getTooltipInfo("download")?.ideal}</div>
                                    </div>
                                )}
                            </div>

                            <div 
                                className="result-card"
                                onMouseEnter={() => setHoveredCard("upload")}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <button 
                                    className="speed-test-info-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setHoveredCard(hoveredCard === 'upload' ? null : 'upload');
                                    }}
                                    aria-label="Show upload speed information"
                                >
                                    <Info size={18} />
                                </button>
                                <div className="result-icon upload-icon">
                                    <Upload size={24} />
                                </div>
                                <div className="result-content">
                                    <div className="result-label">Upload Speed</div>
                                    <div className="result-value">{results.uploadSpeed} <span>Mbps</span></div>
                                    <div className="result-rating" style={{ color: getSpeedRating(results.uploadSpeed).color }}>
                                        {getSpeedRating(results.uploadSpeed).text}
                                    </div>
                                </div>
                                <CheckCircle size={24} color={getSpeedRating(results.uploadSpeed).color} className="check-icon" />
                                {hoveredCard === "upload" && (
                                    <div className="metric-tooltip">
                                        <div className="tooltip-title">{getTooltipInfo("upload")?.title}</div>
                                        <div className="tooltip-description">{getTooltipInfo("upload")?.description}</div>
                                        <div className="tooltip-ideal">💡 {getTooltipInfo("upload")?.ideal}</div>
                                    </div>
                                )}
                            </div>

                            <div 
                                className="result-card"
                                onMouseEnter={() => setHoveredCard("ping")}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <button 
                                    className="speed-test-info-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setHoveredCard(hoveredCard === 'ping' ? null : 'ping');
                                    }}
                                    aria-label="Show ping information"
                                >
                                    <Info size={18} />
                                </button>
                                <div className="result-icon ping-icon">
                                    <Activity size={24} />
                                </div>
                                <div className="result-content">
                                    <div className="result-label">Ping (Latency)</div>
                                    <div className="result-value">{results.ping} <span>ms</span></div>
                                    <div className="result-rating" style={{ color: getPingRating(results.ping).color }}>
                                        {getPingRating(results.ping).text}
                                    </div>
                                </div>
                                <CheckCircle size={24} color={getPingRating(results.ping).color} className="check-icon" />
                                {hoveredCard === "ping" && (
                                    <div className="metric-tooltip">
                                        <div className="tooltip-title">{getTooltipInfo("ping")?.title}</div>
                                        <div className="tooltip-description">{getTooltipInfo("ping")?.description}</div>
                                        <div className="tooltip-ideal">💡 {getTooltipInfo("ping")?.ideal}</div>
                                    </div>
                                )}
                            </div>

                            <div 
                                className="result-card"
                                onMouseEnter={() => setHoveredCard("jitter")}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <button 
                                    className="speed-test-info-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setHoveredCard(hoveredCard === 'jitter' ? null : 'jitter');
                                    }}
                                    aria-label="Show jitter information"
                                >
                                    <Info size={18} />
                                </button>
                                <div className="result-icon jitter-icon">
                                    <Zap size={24} />
                                </div>
                                <div className="result-content">
                                    <div className="result-label">Jitter</div>
                                    <div className="result-value">{results.jitter} <span>ms</span></div>
                                    <div className="result-rating" style={{ color: getJitterRating(results.jitter).color }}>
                                        {getJitterRating(results.jitter).text}
                                    </div>
                                </div>
                                <CheckCircle size={24} color={getJitterRating(results.jitter).color} className="check-icon" />
                                {hoveredCard === "jitter" && (
                                    <div className="metric-tooltip">
                                        <div className="tooltip-title">{getTooltipInfo("jitter")?.title}</div>
                                        <div className="tooltip-description">{getTooltipInfo("jitter")?.description}</div>
                                        <div className="tooltip-ideal">💡 {getTooltipInfo("jitter")?.ideal}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* What You Can Do */}
                        <div className="capabilities-section">
                            <h3>What You Can Do</h3>
                            <div className="capabilities-list">
                                <div className="capability-item">
                                    <span className="capability-name">HD Video Streaming (5 Mbps)</span>
                                    <span className={`capability-status ${canDo("HD Video Streaming", 5) ? "yes" : "no"}`}>
                                        {canDo("HD Video Streaming", 5) ? "✓ Yes" : "✗ No"}
                                    </span>
                                </div>
                                <div className="capability-item">
                                    <span className="capability-name">4K Video Streaming (25 Mbps)</span>
                                    <span className={`capability-status ${canDo("4K Video Streaming", 25) ? "yes" : "no"}`}>
                                        {canDo("4K Video Streaming", 25) ? "✓ Yes" : "✗ No"}
                                    </span>
                                </div>
                                <div className="capability-item">
                                    <span className="capability-name">Video Calls (3 Mbps up)</span>
                                    <span className={`capability-status ${canDo("Video Calls", 3) ? "yes" : "no"}`}>
                                        {canDo("Video Calls", 3) ? "✓ Yes" : "✗ No"}
                                    </span>
                                </div>
                                <div className="capability-item">
                                    <span className="capability-name">Online Gaming (&lt;50ms ping)</span>
                                    <span className={`capability-status ${canDo("Online Gaming", 10) ? "yes" : "no"}`}>
                                        {canDo("Online Gaming", 10) ? "✓ Yes" : "✗ No"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="recommendations-section">
                            <h3>Recommendations</h3>
                            <div className="recommendation-card">
                                <CheckCircle size={24} color="#10b981" />
                                <div className="recommendation-content">
                                    <h4>{getRecommendation()?.title}</h4>
                                    <p>{getRecommendation()?.message}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <p className="test-disclaimer">
                    Note: Results may vary based on network conditions, server location, and device performance.
                </p>
            </div>
        </div>
    );
}

export default function SpeedTestPage() {
    return (
        <Suspense fallback={
            <div className="speed-test-page-new">
                <div className="speed-test-container-new">
                    <div className="test-header">
                        <div className="wifi-icon">
                            <Wifi size={48} />
                        </div>
                        <h1 className="test-title">Internet Speed Test</h1>
                        <p className="test-subtitle">Loading...</p>
                    </div>
                </div>
            </div>
        }>
            <SpeedTestContent />
        </Suspense>
    );
}
