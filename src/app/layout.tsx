import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/Chatbot";
import ScrollObserver from "@/components/ScrollObserver";
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notrik | AI Note Transformation",
  description: "Magical, premium AI note transformation. A glassmorphic experience.",
  icons: {
    icon: '/fevi-con.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans relative bg-white">
        <AuthProvider>
          <ScrollObserver />
          {children}
          
          {/* Global Chatbot */}
          <Chatbot />
        </AuthProvider>
      </body>
    </html>
  );
}
