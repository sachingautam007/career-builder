import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from '@clerk/nextjs'

import { dark } from "@clerk/themes";
import Header from "@/components/header";
import { Toaster } from "sonner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: "NextStep career mentor",
  description: "Powered by NextStep team",
};

export default function RootLayout({ children }) {
  return (


    <ClerkProvider appearance={{
      baseTheme: dark,
    }}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          

            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {/* header describing the heading */}
              <Header />

              <main className="min-h-screen">{children}</main>
              <Toaster richColors/>
              {/* footer show copyright */}
              <footer className="bg-muted/48 py-10 ">
                <div className="container mx-auto px-4 text-center text-gray-400">
                  <p>Made by team NextStep.ai</p>
                </div>
              </footer>
            </ThemeProvider>
         
        </body>
      </html>
    </ClerkProvider>

  );
} 