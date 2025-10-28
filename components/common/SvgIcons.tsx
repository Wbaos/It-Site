
interface SvgIconProps {
    name: "arrow-back" | "user-avatar" | "techcare-logo";
    size?: number;
    color?: string;
    className?: string;
}

export default function SvgIcon({
    name,
    size = 20,
    color = "currentColor",
    className = "",
}: SvgIconProps) {
    switch (name) {
        // ------------------------------------------------------------------------
        // ⬅️ Arrow Back
        // ------------------------------------------------------------------------
        case "arrow-back":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    width={size}
                    height={size}
                    viewBox="0 0 256 256"
                    xmlSpace="preserve"
                    className={className}
                >
                    <g
                        style={{
                            stroke: "none",
                            strokeWidth: 0,
                            strokeDasharray: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10,
                            fill: color,
                            fillRule: "nonzero",
                            opacity: 1,
                        }}
                        transform="translate(1.4066 1.4066) scale(2.81 2.81)"
                    >
                        <path
                            d="M 0.053 44.915 l 33.782 -19.553 v 13.353 h 56.029 c 0.075 0 0.136 0.061 0.136 0.136 v 12.298 c 0 0.075 -0.061 0.136 -0.136 0.136 H 33.835 v 13.353 L 0.053 45.085 C -0.018 45.05 -0.018 44.95 0.053 44.915 z"
                            fill={color}
                            strokeLinecap="round"
                        />
                    </g>
                </svg>
            );

        // ------------------------------------------------------------------------
        // 👤 User Avatar
        // ------------------------------------------------------------------------
        case "user-avatar":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    width={size}
                    height={size}
                    viewBox="0 0 256 256"
                    xmlSpace="preserve"
                    className={className}
                >
                    <g
                        transform="translate(1.4 1.4) scale(2.91)"
                        style={{
                            fill: color,
                            stroke: "none",
                            strokeWidth: 1,
                            strokeLinecap: "round",
                        }}
                    >
                        <path d="M 53.026 45.823 c 3.572 -2.527 5.916 -6.682 5.916 -11.381 C 58.941 26.754 52.688 20.5 45 20.5 s -13.942 6.254 -13.942 13.942 c 0 4.699 2.344 8.854 5.916 11.381 C 28.172 49.092 21.883 57.575 21.883 67.5 c 0 1.104 0.896 2 2 2 s 2 -0.896 2 -2 c 0 -10.541 8.576 -19.116 19.117 -19.116 S 64.116 56.959 64.116 67.5 c 0 1.104 0.896 2 2 2 s 2 -0.896 2 -2 C 68.116 57.575 61.827 49.092 53.026 45.823 z M 35.058 34.442 c 0 -5.482 4.46 -9.942 9.942 -9.942 c 5.481 0 9.941 4.46 9.941 9.942 s -4.46 9.942 -9.941 9.942 C 39.518 44.384 35.058 39.924 35.058 34.442 z" />
                        <path d="M 45 0 C 20.187 0 0 20.187 0 45 c 0 24.813 20.187 45 45 45 c 24.813 0 45 -20.187 45 -45 C 90 20.187 69.813 0 45 0 z M 45 86 C 22.393 86 4 67.607 4 45 S 22.393 4 45 4 s 41 18.393 41 41 S 67.607 86 45 86 z" />
                    </g>
                </svg>
            );

        // ------------------------------------------------------------------------
        // ⚙️ TechCare Logo (Circular Circuit Icon)
        // ------------------------------------------------------------------------
        case "techcare-logo":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={size}
                    height={size}
                    viewBox="0 0 512 512"
                    className={className}
                >
                    <circle cx="256" cy="256" r="248" fill="#0891b2" />
                    <path
                        d="M368 176a144 144 0 1 0 0 160"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="28"
                        strokeLinecap="round"
                    />
                    <circle cx="368" cy="176" r="14" fill="#a7f3d0" />
                    <circle cx="160" cy="256" r="14" fill="#a7f3d0" />
                    <circle cx="368" cy="336" r="14" fill="#a7f3d0" />
                    <path
                        d="M198 180l-20-20M198 332l-20 20M310 112l0 28M310 372l0 28"
                        stroke="#ffffff"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />
                </svg>
            );

        // ------------------------------------------------------------------------
        // Default (no match)
        // ------------------------------------------------------------------------
        default:
            return null;
    }
}
