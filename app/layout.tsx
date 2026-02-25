import type { Metadata, Viewport } from "next";
import "./globals.css";
import SplashCursor from "@/components/SplashCursor";

export const metadata: Metadata = {
  title: "Team 404 — CPU Scheduling Visualizer",
  description: "Schedule smarter. Visualize deeper. Interactive CPU scheduling simulator with FCFS, Round Robin, SJF, SRTF, Priority, and comparison mode.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0A0A0F" />
      </head>
      <body className="font-body antialiased bg-schedos-base text-slate-100">
        <SplashCursor />
        {children}
      </body>
    </html>
  );
}
