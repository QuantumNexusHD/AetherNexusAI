import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

import dotenv from 'dotenv';
import { ClerkProvider } from '@clerk/nextjs'

dotenv.config();

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;


const inter = Inter({ subsets: ['latin']});

export const metadata: Metadata = {
  title: "AetherNexusAI",
  description: "Ai platform for multimodal generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={inter.className}>{children}
        </body>
      </html>
    </ClerkProvider>
  );
}
