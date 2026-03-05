import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const ibmPlexArabic = localFont({
  src: [
    {
      path: "../public/IBM_Plex_Sans_Arabic/IBMPlexSansArabic-Thin.ttf",
      weight: "100",
    },
    {
      path: "../public/IBM_Plex_Sans_Arabic/IBMPlexSansArabic-ExtraLight.ttf",
      weight: "200",
    },
    {
      path: "../public/IBM_Plex_Sans_Arabic/IBMPlexSansArabic-Light.ttf",
      weight: "300",
    },
    {
      path: "../public/IBM_Plex_Sans_Arabic/IBMPlexSansArabic-Regular.ttf",
      weight: "400",
    },
    {
      path: "../public/IBM_Plex_Sans_Arabic/IBMPlexSansArabic-Medium.ttf",
      weight: "500",
    },
    {
      path: "../public/IBM_Plex_Sans_Arabic/IBMPlexSansArabic-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "../public/IBM_Plex_Sans_Arabic/IBMPlexSansArabic-Bold.ttf",
      weight: "700",
    },
  ],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "أهلا وسهلا",
  description: "Live event - multiple choice questions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="dark">
      <body
        className={`${ibmPlexArabic.variable} font-sans antialiased bg-[#0c1222] text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
