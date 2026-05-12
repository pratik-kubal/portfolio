import type { Metadata } from "next";
import { Crimson_Pro, Plus_Jakarta_Sans } from "next/font/google";
import { RturnChatPage } from "@/components/rturn-chat-page";
import { ForceLightTheme } from "@/components/force-light-theme";

const crimson = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--rturn-font-display",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--rturn-font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TURN — Concept Chat Widget",
  description:
    "A concept chat widget for the Tenant Union Representative Network (TURN), Philadelphia.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: { canonical: undefined },
};

export default function RturnDemo() {
  return (
    <div className={`${crimson.variable} ${jakarta.variable}`}>
      <ForceLightTheme />
      <RturnChatPage />
    </div>
  );
}
