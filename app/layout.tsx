import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoiceLoop — AI Voice Agents",
  description: "Deploy AI voice agents for outbound calls. Real-time, on demand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Atmospheric red glow — fixed, behind all content */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            background: `
              radial-gradient(ellipse 70vw 60vh at 90% -5%, rgba(255,59,59,0.13) 0%, transparent 70%),
              radial-gradient(ellipse 40vw 40vh at -5% 100%, rgba(255,59,59,0.05) 0%, transparent 65%)
            `,
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
