import type { Metadata } from "next";
import "./globals.css";
// Load MapLibre CSS globally to avoid dynamic chunk CSS loading errors
import "maplibre-gl/dist/maplibre-gl.css";
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


