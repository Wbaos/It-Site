interface SvgIconProps {
    name:
    | "user-avatar"
    | "calltechcare-logo"
    | "calltechcare-logoName"
    | "calltechcare-logoMobile"
    | "facebook"
    | "instagram"
    | "linkedin"
    | "youtube"
    | "blog-author"
    | "calendar"
    | "chevron-right"
    | "chevron-left"
    | "book-open"
    | "tag"
    | "privacy-shield"
    | "privacy-info-collect"
    | "privacy-how-we-use"
    | "privacy-security"
    | "privacy-sharing"
    | "privacy-cookies"
    | "privacy-children"
    | "privacy-changes"
    | "privacy-questions"
    | "star"
    | "verified-check";
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
        // Arrow  Right
        // ------------------------------------------------------------------------
        case "chevron-right":
            return (
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
                >
                <path d="M5 12h14" />
                <path d="M13 5l7 7-7 7" />
                </svg>
            );
        // ------------------------------------------------------------------------
        // Arrow  Left
        // ------------------------------------------------------------------------
        
        case "chevron-left":
            return (
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
                >
                <path d="M19 12H5" />
                <path d="M11 19l-7-7 7-7" />
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
        //  LinkedIn Icon (white logo, transparent background)
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
        // CallTechCare Logo 
        // ------------------------------------------------------------------------
        case "calltechcare-logoName":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 240 55"
                    width={size}
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
                        <g transform="translate(8,8) scale(1.45)">
                            <path
                                d="M16 2C10.25 2 5.5 6.582 5.5 12v4a2.5 2.5 0 0 0 2.5 2.5h1.5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H8.5C8.65 8.5 12 5.5 16 5.5S23.35 8.5 23.5 13.5H22a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.5a2.5 2.5 0 0 0 2.5-2.5v-4C26 6.582 21.25 2 16 2Zm4.8 16.5a.75.75 0 0 0-1.03.28c-.42.8-1.26 1.42-2.27 1.42h-1.5a1 1 0 1 0 0 2h1.5c1.94 0 3.64-1.2 4.35-2.6a.75.75 0 0 0-.28-1.07Z"
                                fill={color || "#14b8a6"}
                            />
                        </g>

                        <text
                            x="50"
                            y="38"
                            fontFamily="system-ui"
                            fontSize="30"
                            fontWeight="700"
                            fill={color || "#14b8a6"}
                        >
                            Call
                        </text>

                        <text
                            x="103"
                            y="38"
                            fontSize="30"
                            fontFamily="system-ui"
                            fontWeight="700"
                            fill={color || "#14b8a6"}
                        >
                            TechCare
                        </text>
                    </g>
                </svg>
            );
            

        // ---------------------- Logo Mobile (Stacked) ------------------------
         
        case "calltechcare-logoMobile":
            return (
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 130 52"
                width={size}
                className={className}
                role="img"
                aria-label="CallTechCare"
                >
                <g transform="translate(3,1) scale(1.1)">
                    <path
                    d="M16 2C10.25 2 5.5 6.582 5.5 12v4a2.5 2.5 0 0 0 2.5 2.5h1.5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H8.5C8.65 8.5 12 5.5 16 5.5S23.35 8.5 23.5 13.5H22a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.5a2.5 2.5 0 0 0 2.5-2.5v-4C26 6.582 21.25 2 16 2Zm4.8 16.5a.75.75 0 0 0-1.03.28c-.42.8-1.26 1.42-2.27 1.42h-1.5a1 1 0 1 0 0 2h1.5c1.94 0 3.64-1.2 4.35-2.6a.75.75 0 0 0-.28-1.07Z"
                    fill={color || "#14b8a6"}
                    />
                </g>

                <text
                    x="38"
                    y="24"
                    fontFamily="system-ui"
                    fontSize="23"
                    fontWeight="700"
                    fill={color || "#14b8a6"}
                >
                    Call
                </text>

                <text
                    x="10"
                    y="50"
                    fontFamily="system-ui"
                    fontSize="23"
                    fontWeight="700"
                    fill={color || "#14b8a6"}
                >
                    TechCare
                </text>
                </svg>
            );

        // ------------------------------------------------------------------------
        // Blog Author Icon
        // ------------------------------------------------------------------------
        case "blog-author":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={className}
                >
                    <path d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    <path d="M4.5 20.25a7.5 7.5 0 1115 0v.75H4.5v-.75z" />
                </svg>
            );

        // ------------------------------------------------------------------------
        // Calendar Icon
        // ------------------------------------------------------------------------
        case "calendar":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={className}
                >
                    <path d="M8 7V3m8 4V3" />
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M3 11h18" />
                </svg>
            );
        // ------------------------------------------------------------------------
        // --- Open Book
        // ------------------------------------------------------------------------

        case "book-open":
            return (
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 48 48"
                className={className}
                >
                <circle cx="24" cy="24" r="22" fill="#0d172a" opacity="0.8" />

                <g
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M14 16h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3h-7z" />
                    <path d="M34 16h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </g>
                </svg>
            );
        // ------------------------------------------------------------------------
        // Tag
        // ------------------------------------------------------------------------
        case "tag":
            return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={size}
                        height={size}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={className}
                    >
                        <path d="M20.59 13.41L11 3H3v8l9.59 9.59c.78.78 2.05.78 2.83 0l5.17-5.17c.78-.78.78-2.05 0-2.83z" />
                        <circle cx="7.5" cy="7.5" r="1.5" />
                    </svg>
                );
        // ------------------------------------------------------------------------
        // privacy-shield
        // ------------------------------------------------------------------------
        case "privacy-shield":
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
                <circle cx="12" cy="12" r="10"
                    fill="#10b981"
                    fillOpacity="0.15"
                />
                <path
                    d="M12 6.5
                    C13.9 7.3 15.8 7.8 17.5 8.1
                    V11.2
                    C17.5 14.7 15 17.5 12 18.8
                    C9 17.5 6.5 14.7 6.5 11.2
                    V8.1
                    C8.2 7.8 10.1 7.3 12 6.5Z"
                    stroke="#10b981"
                    strokeWidth="1.3"
                    fill="none"
                    strokeLinejoin="round"
                />
                </svg>
            );
        // ------------------------------------------------------------------------
        // privacy-info-collect
        // ------------------------------------------------------------------------
        case "privacy-info-collect":
            return (
                <svg
                width={size}
                height={size}
                viewBox="0 0 28 28"
                className={className}
                fill="none"
                >
                <rect
                    x="0"
                    y="0"
                    width="28"
                    height="28"
                    rx="8"
                    fill="#10b981"
                    fillOpacity="0.10"
                />

                <g transform="translate(5 4) scale(0.75)">
                    <path
                    d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    />
                    <path
                    d="M14 2v4a2 2 0 0 0 2 2h4"
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    />
                    <path d="M10 9H8" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
                    <path d="M16 13H8" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
                    <path d="M16 17H8" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
                </g>
                </svg>
            );


        // ------------------------------------------------------------------------
        // privacy-how-we-use
        // ------------------------------------------------------------------------
        case "privacy-how-we-use":
            return (
                <svg
                width={size}
                height={size}
                viewBox="0 0 28 28"
                className={className}
                fill="none"
                >
                <rect
                    x="0"
                    y="0"
                    width="28"
                    height="28"
                    rx="8"
                    fill="#10b981"
                    fillOpacity="0.10"
                />

                <g transform="translate(5 5) scale(0.75)">
                    <path
                    d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    />
                    <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="#34d399"
                    strokeWidth="2"
                    />
                </g>
                </svg>
            );

        // ------------------------------------------------------------------------
        // privacy-security (exact match to screenshot)
        // ------------------------------------------------------------------------
        case "privacy-security":
            return (
                <svg
                width={size}
                height={size}
                viewBox="0 0 28 28"
                className={className}
                fill="none"
                >
                <rect
                    x="0"
                    y="0"
                    width="28"
                    height="28"
                    rx="8"
                    fill="#10b981"
                    fillOpacity="0.10"
                />

                <g transform="translate(5 5) scale(0.70)">
                    <path
                    d="M7 11V8a5 5 0 0 1 10 0v3"
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    />
                    <rect
                    x="5"
                    y="11"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="#34d399"
                    strokeWidth="2"
                    fill="none"
                    />
                </g>
                </svg>
            );

        // ------------------------------------------------------------------------
        // privacy-sharin
        // ------------------------------------------------------------------------
        case "privacy-sharing":
            return (
                <svg width={size} height={size} viewBox="0 0 28 28" className={className} fill="none">
                <rect x="0" y="0" width="28" height="28" rx="8"
                        fill="#10b981" fillOpacity="0.10" />

                <g transform="translate(4 5) scale(0.75)">
                    <circle cx="18" cy="5" r="3" stroke="#34d399" strokeWidth="2" />
                    <circle cx="6" cy="12" r="3" stroke="#34d399" strokeWidth="2" />
                    <circle cx="18" cy="19" r="3" stroke="#34d399" strokeWidth="2" />
                    <path d="M8.6 10.7l6.8-4.2M8.6 13.3l6.8 4.2"
                        stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
                </g>
                </svg>
            );


        // ------------------------------------------------------------------------
        // privacy-cookies
        // ------------------------------------------------------------------------
        case "privacy-cookies":
            return (
                <svg width={size} height={size} viewBox="0 0 28 28" className={className} fill="none">
                <rect x="0" y="0" width="28" height="28" rx="8"
                        fill="#10b981" fillOpacity="0.10" />

                <g transform="translate(4 5) scale(0.75)">
                    <path
                    d="M21.8 12.1A9 9 0 1 1 11 2.2
                        a4 4 0 0 0 6.9 3.2
                        4 4 0 0 0 3.9 4.7Z"
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    />
                    <circle cx="10" cy="8" r="1" fill="#34d399" />
                    <circle cx="14.5" cy="10" r="1" fill="#34d399" />
                    <circle cx="9" cy="14" r="1" fill="#34d399" />
                    <circle cx="15" cy="15.5" r="1" fill="#34d399" />
                </g>
                </svg>
            );

        // ------------------------------------------------------------------------
        // privacy-children
        // ------------------------------------------------------------------------
        case "privacy-children":
            return (
                <svg width={size} height={size} viewBox="0 0 28 28" className={className} fill="none">
                <rect x="0" y="0" width="28" height="28" rx="8"
                        fill="#10b981" fillOpacity="0.10" />

                <g transform="translate(5 4) scale(0.75)">
                    {/* Adult */}
                    <circle cx="14" cy="7" r="3" stroke="#34d399" strokeWidth="2" />
                    <path d="M10 21v-6a4 4 0 0 1 8 0v6" 
                        stroke="#34d399" strokeWidth="2" strokeLinecap="round"/>

                    {/* Child */}
                    <circle cx="7" cy="12" r="2" stroke="#34d399" strokeWidth="2" />
                    <path d="M5 21v-5a2 2 0 0 1 4 0v5"
                        stroke="#34d399" strokeWidth="2" strokeLinecap="round"/>
                </g>
                </svg>
            );

        // ------------------------------------------------------------------------
        // privacy-changes
        // ------------------------------------------------------------------------
        case "privacy-changes":
            return (
                <svg width={size} height={size} viewBox="0 0 28 28" className={className} fill="none">
                <rect x="0" y="0" width="28" height="28" rx="8"
                        fill="#10b981" fillOpacity="0.10" />

                <g transform="translate(5 5) scale(0.75)">
                    <path
                    d="M3 12a9 9 0 1 1 3 6.7"
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    />
                    <path
                    d="M3 12h4m-4 0v4"
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeLinecap="round"
                    />
                </g>
                </svg>
            );

        // ------------------------------------------------------------------------
        // privacy-questions
        // ------------------------------------------------------------------------
        case "privacy-questions":
            return (
                <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
                <rect width="28" height="28" rx="8" fill="#10b981" fillOpacity="0.10" />
                <g transform="translate(4 4) scale(0.75)">
                    <path
                    d="M6 7h9a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H9l-3 2v-5a3 3 0 0 1 0-5Z"
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    />
                    <path
                    d="M18 14c1.5 0 3 1 3 2.5v3.5l-3-1h-2"
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeLinecap="round"
                    />
                </g>
                </svg>
            );
        // ------------------------------------------------------------------------
        // star
        // ------------------------------------------------------------------------
        case "star":
        return (
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size || 18}
            height={size || 18}
            className={className}
            fill="none" 
            stroke="none"
            >
            <path
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                className="star-shape"
            />
            </svg>
        );
        // ------------------------------------------------------------------------
        // verified-check
        // ------------------------------------------------------------------------
        case "verified-check":
            return (
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={color || "currentColor"}
                width={size || 14}
                height={size || 14}
                className={className}
                >
                <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm-1.2 14.1-4.2-4.2 1.4-1.4 2.8 2.8 5.8-5.8 1.4 1.4Z" />
                </svg>
            );
        // ------------------------------------------------------------------------
        // Default
        // ------------------------------------------------------------------------
        default:
            return null;
    }
}
