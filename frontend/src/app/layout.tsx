import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SolutionForge — AI Strategy Platform",
  description:
    "From raw problem statements to framework-validated execution plans. SolutionForge uses AI to run Lean Canvas, SWOT, Porter's Five Forces, and JTBD analysis — then compiles a launch-ready 30-60-90 day roadmap.",
  keywords: ["AI strategy", "business validation", "lean canvas", "SWOT analysis", "startup planning"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
