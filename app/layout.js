import { cn } from "@/lib/utils";
import { Lexend } from "next/font/google";
import "./globals.css";
import { ClerkProvider, GoogleOneTap } from "@clerk/nextjs";
import { ThemeProvider } from "./_components/theme-provider";
import Navbar from "./_components/Navbar";
import ArrowCursor from "./_components/ArrowCursor";
import { AppContextProvider } from "./provider/AppStates";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
const lexend = Lexend({ subsets: ['latin'] });
export const metadata = {
  title: "Sarthi",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <GoogleOneTap />
        <body className={cn(
          lexend.className,
      )}
      >
          <ThemeProvider>
               <AppContextProvider>
                <ArrowCursor/>
                <Navbar />
              {children}
              <Analytics />
              <SpeedInsights />
              <Toaster />
               </AppContextProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
