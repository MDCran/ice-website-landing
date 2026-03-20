import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import CursorGlow from "@/components/effects/CursorGlow";
import NoiseOverlay from "@/components/effects/NoiseOverlay";

const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "International Computer Exchange",
  description:
    "IBM Business Partner since 1990 — International Computer Exchange is currently updating its online presence. We remain fully available to support existing clients and discuss new opportunities for enterprise technology solutions.",
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
        className={`${geist.variable} font-sans antialiased scan-line overflow-x-hidden`}
      >
        <CursorGlow />
        <NoiseOverlay />
        {children}
      </body>
    </html>
  );
}
