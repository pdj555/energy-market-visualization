import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Ubuntu_Mono } from 'next/font/google';
import { QueryProvider } from '@/providers/query-provider';
import './globals.css';

const mono = Ubuntu_Mono({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-mono',
  display: 'swap',
});

const themeInitScript = `(function(){try{var s=localStorage.getItem('theme');var d=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export const metadata: Metadata = {
  title: 'Energy Intelligence',
  description: 'Wholesale market telemetry across five ISO regions.',
  openGraph: {
    title: 'Energy Intelligence',
    description: 'Synthetic wholesale market dashboard.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#05080c' },
    { color: '#ffffff' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable} suppressHydrationWarning>
      <body className="min-h-screen">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
