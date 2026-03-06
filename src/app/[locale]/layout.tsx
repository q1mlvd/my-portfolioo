import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EntryCaptcha } from "@/components/ui/EntryCaptcha";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Mikhailo Kravchuk — Web Developer & Bot Engineer",
  description:
    "Full-stack developer specializing in scalable web applications, Telegram/Discord bots, and database architecture.",
  keywords: [
    "web developer",
    "bot developer",
    "Telegram bot",
    "Discord bot",
    "Next.js",
    "database architecture",
    "freelance",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Mikhailo Kravchuk",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="font-inter antialiased">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <EntryCaptcha />
            <Navbar />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
