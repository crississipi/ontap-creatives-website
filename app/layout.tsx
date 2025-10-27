import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";
import VisitorTracker from "@/components/VisitorTracker";

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
      <body>
        <UserProvider>
          <VisitorTracker />
          {children}
        </UserProvider>
      </body>
    </html>
  )
}


