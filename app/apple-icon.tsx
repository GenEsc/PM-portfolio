import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** White logo mark used on the colored apple-touch background. */
const whiteLogo = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none">
<g stroke="#ffffff" fill="#ffffff">
<circle cx="50" cy="50" r="46" stroke-width="4" fill="none"/>
<g stroke-width="3.5" stroke-linecap="round">
<line x1="50" y1="37" x2="50" y2="16"/><line x1="56.5" y1="38.74" x2="67" y2="20.56"/>
<line x1="61.26" y1="43.5" x2="79.44" y2="33"/><line x1="63" y1="50" x2="84" y2="50"/>
<line x1="61.26" y1="56.5" x2="79.44" y2="67"/><line x1="56.5" y1="61.26" x2="67" y2="79.44"/>
<line x1="50" y1="63" x2="50" y2="84"/><line x1="43.5" y1="61.26" x2="33" y2="79.44"/>
<line x1="38.74" y1="56.5" x2="20.56" y2="67"/><line x1="37" y1="50" x2="16" y2="50"/>
<line x1="38.74" y1="43.5" x2="20.56" y2="33"/><line x1="43.5" y1="38.74" x2="33" y2="20.56"/>
</g>
<g>
<circle cx="50" cy="16" r="4.5"/><circle cx="67" cy="20.56" r="4.5"/><circle cx="79.44" cy="33" r="4.5"/>
<circle cx="84" cy="50" r="4.5"/><circle cx="79.44" cy="67" r="4.5"/><circle cx="67" cy="79.44" r="4.5"/>
<circle cx="50" cy="84" r="4.5"/><circle cx="33" cy="79.44" r="4.5"/><circle cx="20.56" cy="67" r="4.5"/>
<circle cx="16" cy="50" r="4.5"/><circle cx="20.56" cy="33" r="4.5"/><circle cx="33" cy="20.56" r="4.5"/>
</g>
<circle cx="50" cy="50" r="6.5" stroke-width="4" fill="none"/>
</g></svg>`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1D9E75",
          borderRadius: 40,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={120}
          height={120}
          alt=""
          src={`data:image/svg+xml,${encodeURIComponent(whiteLogo)}`}
        />
      </div>
    ),
    { ...size }
  );
}
