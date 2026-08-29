import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProPrintAssistantV2 } from "@/components/ProPrintAssistantV2";
import { ProPrintChatAutoScroll } from "@/components/ProPrintChatAutoScroll";

export const metadata: Metadata = {
  title: {
    default: "ProPrint Solutions | IT, Printing & Technical Services Kuwait",
    template: "%s | ProPrint Solutions",
  },
  description:
    "ProPrint Solutions provides IT products, printers, plotters, service center support, AMC, enterprise IT and onsite field services across Kuwait.",
  keywords: [
    "ProPrint Solutions Kuwait",
    "IT products Kuwait",
    "printers Kuwait",
    "plotters Kuwait",
    "laptops Kuwait",
    "printer repair Kuwait",
    "IT AMC Kuwait",
    "enterprise IT support Kuwait",
  ],
  applicationName: "ProPrint Solutions",
  category: "technology",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_KW",
    siteName: "ProPrint Solutions",
    title: "ProPrint Solutions | IT, Printing & Technical Services Kuwait",
    description:
      "Technology products, professional printing, service center, AMC and enterprise IT support across Kuwait.",
  },
  twitter: {
    card: "summary",
    title: "ProPrint Solutions",
    description: "IT products, printing, service, AMC and enterprise support in Kuwait.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#061321",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <ProPrintAssistantV2 />
        <ProPrintChatAutoScroll />
      </body>
    </html>
  );
}
