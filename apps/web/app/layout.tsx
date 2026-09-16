import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sentix AI — Social Sentiment Intelligence",
  description: "Analyze social-media text using natural language processing and machine learning.",
  keywords: [
    "sentiment analysis",
    "NLP",
    "machine learning",
    "social sentiment",
    "text classification",
    "Twitter sentiment",
    "RoBERTa",
    "VADER"
  ],
  openGraph: {
    title: "Sentix AI — Social Sentiment Intelligence Platform",
    description: "Analyze social-media text using natural language processing and machine learning.",
    siteName: "Sentix AI",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#06090f] text-slate-100 min-h-screen antialiased selection:bg-indigo-500/30">
        {children}
      </body>
    </html>
  );
}
