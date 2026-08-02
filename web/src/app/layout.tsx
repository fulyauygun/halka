import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { WalletProvider } from "@/lib/wallet";
import { WalletButton } from "@/components/wallet-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Halka — Dijital Altın Günü",
  description: "Stellar Soroban üzerinde custody riski olmayan rotating savings circle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <WalletProvider>
          <header className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
            <div className="mx-auto flex max-w-3xl items-center justify-between">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                Halka
              </Link>
              <WalletButton />
            </div>
          </header>
          <div className="flex-1">{children}</div>
        </WalletProvider>
      </body>
    </html>
  );
}
