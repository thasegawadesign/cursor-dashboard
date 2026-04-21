import "@/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { JetBrains_Mono, Syne } from "next/font/google";

const GA_ID_PATTERN = /^G-[A-Z0-9]+$/i;

function getGaMeasurementId(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_GA_ID?.trim();
  if (!raw || !GA_ID_PATTERN.test(raw)) return undefined;
  return raw;
}

function toAbsoluteUrl(raw: string): URL | undefined {
  const value = raw.trim();
  if (!value) return undefined;

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(withProtocol);
  } catch {
    return undefined;
  }
}

function getMetadataBase(): URL | undefined {
  const direct = process.env.NEXT_PUBLIC_SITE_URL;
  if (direct) {
    const parsed = toAbsoluteUrl(direct);
    if (parsed) return parsed;
  }

  const vercel = process.env.VERCEL_URL;
  if (vercel) return toAbsoluteUrl(vercel);

  return undefined;
}

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: "Cursor Dashboard",
  description: "マウスカーソルのライブメトリクスとセッション可視化",
  openGraph: {
    title: "Cursor Dashboard",
    description: "マウスカーソルのライブメトリクスとセッション可視化",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cursor Dashboard",
    description: "マウスカーソルのライブメトリクスとセッション可視化",
    images: ["/opengraph-image"],
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = getGaMeasurementId();

  return (
    <html
      lang="ja"
      className={`${syne.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
