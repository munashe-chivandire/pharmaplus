import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "PharmPlus - Medical Scheme Administration Platform",
    template: "%s | PharmPlus",
  },
  description:
    "The all-in-one platform for managing medical scheme membership applications, processing claims, and delivering exceptional healthcare benefits administration.",
  keywords: [
    "medical scheme",
    "healthcare administration",
    "membership management",
    "health insurance",
    "claims processing",
    "Zimbabwe",
    "medical aid",
  ],
  authors: [{ name: "PharmPlus" }],
  creator: "PharmPlus",
  openGraph: {
    type: "website",
    locale: "en_ZW",
    url: "https://pharmplus.co.zw",
    title: "PharmPlus - Medical Scheme Administration Platform",
    description:
      "Streamline your medical scheme administration with our powerful SaaS platform.",
    siteName: "PharmPlus",
  },
  twitter: {
    card: "summary_large_image",
    title: "PharmPlus - Medical Scheme Administration Platform",
    description:
      "Streamline your medical scheme administration with our powerful SaaS platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
