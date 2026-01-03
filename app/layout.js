import { Geist, Geist_Mono, Kumar_One_Outline } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header";
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown, FileTextIcon, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from "lucide-react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


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
            <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md ">
              <nav className="conatiner mx-auto flex px-4 h-16 items-center justify-between">
                <Link href="/" className="flex items-center"> 
                <Image src="/logo.png" 
                 alt="/logo.png"
                 width={200} 
                 height={60}
                 className="h-12 py-1 w-auto object-contain"/>
                 </Link>
                  
  
          
    
              <div className="flex items-center space-x-2 md:space-x-3"> 
                {/* <Signin> */}
              <ModeToggle />
                <Link href={"/industry-insights"}>
                <Button>
                  <LayoutDashboard className="h-4 w-4"/>
                  <span className="hidden md:block">Industry Insights</span>
                </Button>
                </Link>

                {/* </Signin> */}
                <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button className={"flex items-centre gap-2"}>
                  <StarsIcon className="h-4 w-4"/>
                  <span className="hidden md:block">Upscale</span>
                  <ChevronDown className="h-4 w-4"/>
                </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
   
    <DropdownMenuItem asChild>
      <Link href={"/cover-letter"} 
      className="flex items-center gap-2">
      <PenBox className="h-4 w-4"/>Cover Letter
      </Link>
    </DropdownMenuItem>

    <DropdownMenuItem asChild>
      <Link href={"/mock-test"} className="flex items-center gap-2"> 
      <GraduationCap className="h-4 w-4"/>
      Mock Interview
      </Link>
    </DropdownMenuItem>

    <DropdownMenuItem asChild>
       <Link href={"/ATS"} className="flex items-center gap-2">
      <FileTextIcon className="h-4 w-4"/>
      ATS Resume Scanner
      </Link>
    </DropdownMenuItem>

    
  </DropdownMenuContent>
</DropdownMenu>
              </div>

          
       
              </nav>
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