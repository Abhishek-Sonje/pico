import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#8b7cff",
        borderRadius: 16,
        color: "#090812",
        display: "flex",
        fontSize: 36,
        fontWeight: 800,
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      P
    </div>,
    size,
  );
}
