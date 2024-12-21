"use client";

import { useQuery } from "convex/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthActions } from "@convex-dev/auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";

import { ChevronsLeftRight, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export const UserItem: React.FC = () => {
  const router = useRouter();
  const user = useQuery(api.users.currentUser);
  const { signOut } = useAuthActions();

  const redirectAfter = 100;

  const handleSignOut = async () => {
    try {
      await signOut();
      setTimeout(() => {
        router.push("/login");
      }, redirectAfter);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center text-sm w-full p-3 hover:bg-primary/5 cursor-pointer">
          <div className="gap-x-2 flex items-center max-w-[150px]">
            <Avatar className="w-4 h-4">
              <AvatarImage
                src={user?.image}
                className="aspect-square rounded-md"
              />
              <AvatarFallback className="aspect-square bg-sky-400 text-white text-xs">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-start font-medium line-clamp-1">
              {user?.name?.split(" ")[0].toString()}&apos;s Notion Clone
            </span>
          </div>

          <ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground w-4 h-4" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="flex flex-col space-y-4 p-2">
          <p className="text-xs font-medium leading-none text-muted-foreground">
            {user?.email}
          </p>
          <div className="flex items-center gap-x-2">
            <div className="rounded-md bg-secondary p-1">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={user?.image}
                  className="aspect-square rounded-md"
                />
                <AvatarFallback className="aspect-square bg-sky-400 text-white text-[16px]">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-1">
              <p className="text-sm line-clamp-1">
                {user?.name?.split(" ")[0].toString()}&apos;s Notion Clone
              </p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="h-10 cursor-pointer"
        >
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
