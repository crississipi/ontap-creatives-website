import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OnTap Creatives",
  description: "Developed by OnTap Creatives Team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased h-[100vh] w-[100vw] md:overflow-x-hidden scroll-smooth motion-reduce:scroll-auto`}
      >
        {children}
      </body>
    </html>
  );
}



