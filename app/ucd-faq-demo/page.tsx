import type { Metadata } from "next";
import { DM_Serif_Display } from "next/font/google";
import { UcdFaqPage } from "@/components/ucd-faq-page";
import { ForceLightTheme } from "@/components/force-light-theme";

const dmSerif = DM_Serif_Display({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--ucd-font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "City Desk — FAQ Chat",
  description:
    "An interactive FAQ chat demo for the University City help desk.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: undefined,
  },
};

export default function UcdFaqDemo() {
  return (
    <div className={dmSerif.variable}>
      <ForceLightTheme />
      <UcdFaqPage />
    </div>
  );
}
