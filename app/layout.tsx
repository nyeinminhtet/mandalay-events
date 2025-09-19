import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

const popins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "---font-poppins",
});

export const metadata: Metadata = {
  title: {
    template: "Mandalay Events | %s",
    default: "Mandalay Events",
  },
  description: "Find out the happiest events in Madalay.",
  icons: {
    icon: "/assets/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={popins.variable}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
