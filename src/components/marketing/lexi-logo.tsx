"use client";

export function LexiLogo({
  height = 36,
  variant = "brand",
}: {
  height?: number;
  variant?: "brand" | "white";
}) {
  const isBrand = variant === "brand";
  // The full SVG viewBox is 49.53 x 10.87, aspect ratio ~4.56:1
  const width = (height / 10.87) * 49.53;

  return (
    <svg
      viewBox="0 0 49.53 10.87"
      width={width}
      height={height}
      aria-label="LexiReview - AI Contract Intelligence"
      role="img"
    >
      <defs>
        <linearGradient id="lexi-full-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={isBrand ? "#2563eb" : "#ffffff"} />
          <stop offset="1" stopColor={isBrand ? "#1d4ed8" : "#ffffff"} />
        </linearGradient>
        <linearGradient id="lexi-full-overlay" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g>
        {/* Shield icon */}
        <path fill="url(#lexi-full-grad)" d="M1.45,0h5.79c.72,0,1.45.72,1.45,1.45v4.71c0,1.81-3.62,3.26-4.34,3.62-.72-.36-4.34-1.81-4.34-3.62V1.45C0,.72.72,0,1.45,0Z" />
        <path fill="url(#lexi-full-overlay)" d="M1.45,0h5.79c.72,0,1.45.72,1.45,1.45v4.71c0,1.81-3.62,3.26-4.34,3.62-.72-.36-4.34-1.81-4.34-3.62V1.45C0,.72.72,0,1.45,0Z" />
        {/* Document lines */}
        <path fill="#fff" opacity="0.45" d="M2.4,2.17h2.08c.12,0,.23.1.23.23h0c0,.12-.1.23-.23.23h-2.08c-.12,0-.23-.1-.23-.23h0c0-.12.1-.23.23-.23Z" />
        <path fill="#fff" opacity="0.45" d="M2.4,3.26h3.17c.12,0,.23.1.23.23h0c0,.12-.1.23-.23.23h-3.17c-.12,0-.23-.1-.23-.23h0c0-.12.1-.23.23-.23Z" />
        <path fill="#fff" opacity="0.35" d="M2.4,4.34h1.36c.12,0,.23.1.23.23h0c0,.12-.1.23-.23.23h-1.36c-.12,0-.23-.1-.23-.23h0c0-.12.1-.23.23-.23Z" />
        {/* Checkmark circle */}
        <circle fill="#fff" cx="6.43" cy="5.93" r="1.59" />
        <circle fill="#10b981" cx="6.43" cy="5.93" r="1.27" />
        <polyline fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.25" points="5.74 5.93 6.16 6.41 7.19 5.37" />
      </g>
      {/* Text */}
      <text
        x="12.58"
        y="6.8"
        fill={isBrand ? "#0f172a" : "#ffffff"}
        fontFamily="var(--font-heading), 'Helvetica Neue', sans-serif"
        fontSize="6.36"
        fontWeight="700"
        letterSpacing="-0.01em"
      >
        Lexi
      </text>
      <text
        x="27.28"
        y="6.8"
        fill={isBrand ? "#2563eb" : "#ffffff"}
        fontFamily="var(--font-heading), 'Helvetica Neue', sans-serif"
        fontSize="6.36"
        fontWeight="700"
        letterSpacing="-0.01em"
      >
        Review
      </text>
      <text
        x="12.58"
        y="9.78"
        fill={isBrand ? "#94a3b8" : "rgba(255,255,255,0.6)"}
        fontFamily="var(--font-body), Poppins, sans-serif"
        fontSize="1.89"
        fontWeight="500"
        letterSpacing="0.26em"
      >
        AI CONTRACT INTELLIGENCE
      </text>
    </svg>
  );
}
