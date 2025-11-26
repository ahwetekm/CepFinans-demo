import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import PageTransition from "@/components/page-transition";

// Meta bilgileri
export const metadata: Metadata = {
  title: "ButcApp - Kişisel Muhasebe",
  description: "Nakit, birikim ve banka hesabınızı takip edin. Kişisel muhasebe uygulaması.",
  keywords: ["ButcApp", "muhasebe", "finans", "bütçe", "kişisel finans"],
  authors: [{ name: "ButcApp Team" }],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon-16x16.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "ButcApp - Kişisel Muhasebe",
    description: "Nakit, birikim ve banka hesabınızı takip edin",
    url: "https://chat.z.ai",
    siteName: "ButcApp",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ButcApp - Kişisel Muhasebe",
    description: "Nakit, birikim ve banka hesabınızı takip edin",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className="antialiased bg-background text-foreground"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
          transitionDuration={300}
        >
          <AuthProvider>
            <LanguageProvider>
              <PageTransition>
                {children}
              </PageTransition>
              <Toaster />
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}