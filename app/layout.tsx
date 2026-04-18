import '@/globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { JetBrains_Mono, Syne } from 'next/font/google';

const GA_ID_PATTERN = /^G-[A-Z0-9]+$/i;

function getGaMeasurementId(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_GA_ID?.trim();
  if (!raw || !GA_ID_PATTERN.test(raw)) return undefined;
  return raw;
}

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cursor Dashboard',
  description: 'マウスカーソルのライブメトリクスとセッション可視化',
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
    >
      <body className="flex min-h-full flex-col">
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
        {children}
      </body>
    </html>
  );
}
