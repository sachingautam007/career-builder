import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header";
import { ModeToggle } from "@/components/mode-toggle"

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
            <header className="flex justify-between px-6 py-4">

            <Header />
         <div className="flex justify-end px-70 py=10">
              <ModeToggle />
          </div>
            </header>
            

            
            <main className="min-h-screen">{children}</main>
            {/* footer show capyright */}
            <footer className="bg-muted/48 py-10">
            <div className="container mx-auto px-4 text-center text-gray-400">
              <p>Made by team NextStep.ai</p>
            </div>
            </footer>
          </ThemeProvider>
      </body>
    </html>
           
  );
}
