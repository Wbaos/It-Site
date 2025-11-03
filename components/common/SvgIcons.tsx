interface SvgIconProps {
    name:
    | "arrow-back"
    | "user-avatar"
    | "calltechcare-logo"
    | "calltechcare-logoName"
    | "facebook"
    | "instagram"
    | "linkedin"
    | "youtube";
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
        //  Arrow Back
        // ------------------------------------------------------------------------
        case "arrow-back":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={size}
                    height={size}
                    viewBox="0 0 256 256"
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
        // User Avatar
        // ------------------------------------------------------------------------
        case "user-avatar":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={size}
                    height={size}
                    viewBox="0 0 256 256"
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
        // TechCare Logo (Circular Circuit Icon)
        // ------------------------------------------------------------------------
        case "calltechcare-logo":
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
        //  Facebook Icon (white "F", transparent background)
        // ------------------------------------------------------------------------
        case "facebook":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    width={size}
                    height={size}
                    className={className}
                >
                    <path
                        fill="#ffffff"
                        d="M27.5 10h4.5V3h-4.5c-5.5 0-9 3.3-9 8.9V17h-4v6h4v16h6v-16h5l1-6h-6v-4.1c0-1.5.4-2.9 2.5-2.9z"
                    />
                </svg>
            );

        // ------------------------------------------------------------------------
        //  Instagram Icon (white, transparent background)
        // ------------------------------------------------------------------------
        case "instagram":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    width={size}
                    height={size}
                    className={className}
                >
                    <path
                        fill="#ffffff"
                        d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9S160.5 370.8 224.1 370.8 339 319.5 339 255.9 287.7 141 224.1 141zm0 188.6c-40.6 0-73.7-33.1-73.7-73.7s33.1-73.7 73.7-73.7 73.7 33.1 73.7 73.7-33.1 73.7-73.7 73.7zm146.4-194.3c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-1.7-35.7-9.9-67.3-36.2-93.6-26.3-26.3-57.9-34.5-93.6-36.2-37-2.1-147.9-2.1-184.9 0-35.7 1.7-67.3 9.9-93.6 36.2s-34.5 57.9-36.2 93.6c-2.1 37-2.1 147.9 0 184.9 1.7 35.7 9.9 67.3 36.2 93.6 26.3 26.3 57.9 34.5 93.6 36.2 37 2.1 147.9 2.1 184.9 0 35.7-1.7 67.3-9.9 93.6-36.2 26.3-26.3 34.5-57.9 36.2-93.6 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.5-22.9 34.6-42.4 42.4-29.4 11.7-99.2 9-132.3 9s-102.9 2.6-132.3-9c-19.5-7.8-34.6-22.9-42.4-42.4-11.7-29.4-9-99.2-9-132.3s-2.6-102.9 9-132.3c7.8-19.5 22.9-34.6 42.4-42.4 29.4-11.7 99.2-9 132.3-9s102.9-2.6 132.3 9c19.5 7.8 34.6 22.9 42.4 42.4 11.7 29.4 9 99.2 9 132.3s2.7 102.9-9 132.3z"
                    />
                </svg>
            );
        // ------------------------------------------------------------------------
        // 💼 LinkedIn Icon (white logo, transparent background)
        // ------------------------------------------------------------------------
        case "linkedin":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    width={size}
                    height={size}
                    className={className}
                >
                    <path
                        fill="#ffffff"
                        d="M100.28 448H7.4V148.9h92.88V448zM53.79 108.1C24.09 108.1 0 83.49 0 53.8A53.79 53.79 0 0 1 107.6 53.8c0 29.69-24.1 54.3-53.81 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.24-79.2-48.3 0-55.7 37.7-55.7 76.6V448h-92.7V148.9h88.9v40.8h1.3c12.4-23.5 42.6-48.3 87.7-48.3c93.8 0 111 61.8 111 142.3V448z"
                    />
                </svg>
            );
        // ------------------------------------------------------------------------
        // CallTechCare Logo (Compact width, perfect alignment - fixed height error)
        // ------------------------------------------------------------------------
        case "calltechcare-logoName":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 240 55"
                    width="200"
                    className={className}
                    role="img"
                    aria-label="CallTechCare"
                    style={{
                        display: "block",
                        verticalAlign: "middle",
                        height: "auto",
                    }}
                >
                    <g transform="translate(0,2)">
                        <g transform="translate(0,8) scale(1.35)">
                            <path
                                d="M16 2C10.25 2 5.5 6.582 5.5 12v4a2.5 2.5 0 0 0 2.5 2.5h1.5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H8.5C8.65 8.5 12 5.5 16 5.5S23.35 8.5 23.5 13.5H22a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.5a2.5 2.5 0 0 0 2.5-2.5v-4C26 6.582 21.25 2 16 2Zm4.8 16.5a.75.75 0 0 0-1.03.28c-.42.8-1.26 1.42-2.27 1.42h-1.5a1 1 0 1 0 0 2h1.5c1.94 0 3.64-1.2 4.35-2.6a.75.75 0 0 0-.28-1.07Z"
                                fill="#0094FF"
                            />
                        </g>

                        <text
                            x="50"
                            y="38"
                            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Inter', Roboto, 'Helvetica Neue', Arial, sans-serif"
                            fontSize="30"
                            fontWeight="700"
                            fill="#0094FF"
                            style={{ letterSpacing: "-0.4px" }}
                        >
                            Call
                        </text>

                        <text
                            x="110"
                            y="38"
                            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Inter', Roboto, 'Helvetica Neue', Arial, sans-serif"
                            fontSize="30"
                            fontWeight="700"
                            fill="#1F2937"
                            style={{ letterSpacing: "-0.4px" }}
                        >
                            TechCare
                        </text>
                    </g>
                </svg>
            );

        // ------------------------------------------------------------------------
        // Default
        // ------------------------------------------------------------------------
        default:
            return null;
    }
}
