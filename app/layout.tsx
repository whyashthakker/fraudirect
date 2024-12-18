import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Open Source Fraud Reporting Directory",
  description: "Fraudb.online is a community run directory to report fraud.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
