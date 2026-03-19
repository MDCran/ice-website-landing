import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist } from "next/font/google";
import "./globals.css";
import CursorGlow from "@/components/effects/CursorGlow";
import NoiseOverlay from "@/components/effects/NoiseOverlay";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "International Computer Exchange — Under Maintenance",
  description:
    "IBM Business Partner since 1990 — our website is currently under maintenance. We'll be back soon with enterprise technology solutions including cloud hosting, data protection, security, and managed services.",
  icons: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("ice-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${geist.variable} ${inter.variable} font-sans antialiased scan-line overflow-x-hidden`}
      >
        <CursorGlow />
        <NoiseOverlay />
        {children}
      </body>
    </html>
  );
}
