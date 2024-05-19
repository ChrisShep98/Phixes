import type { Metadata } from "next";
import { AR_One_Sans } from "next/font/google";
import { AuthProvder } from "./providers/SessionProvider";
import "./globals.css";
import { getServerSession } from "next-auth";

const arOneSans = AR_One_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Phixes",
  description: "Generated by create next app",
  icons: {
    icon: [
      {
        url: "/images/Red_circle.png",
      },
    ],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={arOneSans.className}>
        <AuthProvder session={session}>{children}</AuthProvder>
      </body>
    </html>
  );
}
