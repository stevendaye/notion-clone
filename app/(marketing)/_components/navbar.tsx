"use client";

import Link from "next/link";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { useConvexAuth } from "convex/react";
import { cn } from "@/lib/utils";
import {
  ClerkLoaded,
  SignedIn,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

import { Logo } from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <nav
      className={cn(
        "z-50 bg-background fixed top-0 flex items-center w-full px-6 py-4 dark:bg-[#1F1F1F]",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />

      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        {isLoading && <Spinner />}

        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button variant={"ghost"} size={"sm"}>
                Log in
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size={"sm"}>Get Notion Clone Free</Button>
            </SignInButton>
          </>
        )}

        {isAuthenticated && !isLoading && (
          <>
            <Button variant={"ghost"} size={"sm"} asChild>
              <Link href={"/documents"}>Enter Notion Clone</Link>
            </Button>

            {/* Check Deprecation of afterSignOutUrl prop */}
            <UserButton afterSwitchSessionUrl="/" />
          </>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
};
