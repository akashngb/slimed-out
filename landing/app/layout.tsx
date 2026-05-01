import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SlimedOut — Sabotage your LinkedIn',
  description: 'LinkedIn just got a lot more dangerous. Slime your competition. Claim your territory. A satirical Chrome extension.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-bg text-text scroll-smooth antialiased">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&f[]=satoshi@400,500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col relative overflow-x-hidden w-full m-0 p-0">
        {children}
      </body>
    </html>
  );
}
