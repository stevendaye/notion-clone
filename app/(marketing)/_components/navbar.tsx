"use client";

import Link from "next/link";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { useConvexAuth } from "convex/react";
import { cn } from "@/lib/utils";

import { Logo } from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";

export const Navbar: React.FC = () => {
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
            <Button variant={"ghost"} size={"sm"} asChild>
              <Link href={"/login"}>Log in</Link>
            </Button>
            <Button size={"sm"} asChild>
              <Link href={"/login"}>Get Notion Clone Free</Link>
            </Button>
          </>
        )}

        {isAuthenticated && !isLoading && (
          <Button variant={"ghost"} size={"sm"} asChild>
            <Link href={"/documents"}>Enter Notion Clone</Link>
          </Button>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
};
