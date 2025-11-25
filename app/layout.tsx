import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { moulpali, akbalthom } from "./fonts";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const GID = "G-CF5T4R7R55";

// export const metadata: Metadata = {
//   title: "Wedding Invitation | Sour Sakada & Em Kakada",
//   description:
//     "You are warmly invited to celebrate the wedding of Sour Sakada & Em Kakada...",
//   keywords: "wedding, invitation, Sour Sakada, Em Kakada...",
//   icons: { icon: "/favicon.png" },
//   openGraph: {
//     title: "Wedding Invitation | Sour Sakada & Em Kakada",
//     description: "Celebrate the wedding of Sour Sakada & Em Kakada...",
//     url: "https://sakada-kakada-invitation.vercel.app",
//     siteName: "Wedding Invitation",
//     images: [
//       {
//         url: `${baseUrl}/images/wedding/001A7207.webp`,
//         width: 300,
//         height: 300,
//       },
//     ],
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Wedding Invitation | Sour Sakada & Em Kakada",
//     description: "We are delighted to invite you to the wedding celebration...",
//     images: [`${baseUrl}/images/wedding/001A7207.webp`],
//   },
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${moulpali.variable}
          ${akbalthom.variable}
          antialiased
        `}
      >
        {children}
        <GoogleAnalytics gaId={GID} />
      </body>
    </html>
  );
}
