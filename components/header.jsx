"use server";
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown, FileTextIcon, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from "lucide-react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, } from '@clerk/nextjs'
import { checkUser } from "@/lib/checkUser";


const Header = async () => {
  await checkUser();
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md ">
      <nav className="mx-auto flex px-4 h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png"
            alt="/logo.png"
            width={200}
            height={60}
            className="h-12 py-1 w-auto object-contain" />
        </Link>


        <div className="flex items-center space-x-2 md:space-x-3">

          <ModeToggle />
          <SignedOut>
            {/* <SignInButton /> */}
            <SignUpButton>
              <button className="bg-background hover:bg-purple-600 text-cyan-200 hover:text-white px-4 py-2 rounded-md transition">
                Login
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold"
                }
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>

          <SignedIn>
            <Link href={"/industry-insights"}>
              <Button>
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:block">Industry Insights</span>
              </Button>
            </Link>


            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className={"flex items-centre gap-2"}>
                  <StarsIcon className="h-4 w-4" />
                  <span className="hidden md:block">Upscale</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>

                <DropdownMenuItem asChild>
                  <Link href={"/cover-letter"}
                    className="flex items-center gap-2">
                    <PenBox className="h-4 w-4" />Cover Letter
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={"/mockinterview"} className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Mock Interview
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={"/ATS"} className="flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4" />
                    ATS Resume Scanner
                  </Link>
                </DropdownMenuItem>


              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>
        </div>



      </nav>
    </header>



  );
};
export default Header;