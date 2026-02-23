import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team 404 — CPU Scheduling Visualizer",
  description: "Schedule smarter. Visualize deeper. Interactive CPU scheduling simulator with FCFS, Round Robin, SJF, SRTF, Priority, and comparison mode.",
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
        {children}
      </body>
    </html>
  );
}
