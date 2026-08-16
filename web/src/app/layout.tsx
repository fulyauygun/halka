import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { WalletProvider } from "@/lib/wallet";
import { WalletButton } from "@/components/wallet-button";
import { NazarBead } from "@/components/nazar-bead";
import { KilimStrip } from "@/components/kilim-strip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Halka — Digital "Altın Günü"',
  description: "A custody-risk-free rotating savings circle on Stellar Soroban.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <WalletProvider>
          <header className="bg-card px-6 py-4">
            <div className="mx-auto flex max-w-3xl items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5">
                <NazarBead size={30} />
                <span className="text-xl font-semibold tracking-tight text-foreground">
                  Halka
                </span>
              </Link>
              <WalletButton />
            </div>
          </header>
          <KilimStrip />
          <div className="flex-1">{children}</div>
          <KilimStrip />
          <footer className="bg-card px-6 py-6 text-center text-xs text-muted">
            Halka — a digital altın günü on Stellar Soroban · testnet
          </footer>
        </WalletProvider>
      </body>
    </html>
  );
}
