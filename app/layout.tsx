import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import "./globals.css";
import { createOptionalClient } from "@/lib/supabase/server";
import { isGoogleSheetConfigured } from "@/lib/google-sheet-events";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-noto-sans-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Modern Trade Event Tracking",
  description: "Calendar and event workspace for Modern Trade campaigns",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createOptionalClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  return (
    <html lang="th" className={notoSansThai.variable}>
      <body className="font-sans antialiased">
        <AppShell userEmail={user?.email ?? null} sourceLabel={isGoogleSheetConfigured() ? "Google Sheet" : "Local JSON"}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
