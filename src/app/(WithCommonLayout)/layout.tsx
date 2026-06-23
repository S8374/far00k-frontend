import { Outfit } from "next/font/google";
import { ReactNode } from "react";

export const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export default function CommonLayout({ children }: { children: ReactNode }) {
  return (
    <div className={outfit.variable}>
      {children}
    </div>
  );
}