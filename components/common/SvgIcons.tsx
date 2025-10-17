interface SvgIconProps {
    name: "arrow-back";
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

        default:
            return null;
    }
}
