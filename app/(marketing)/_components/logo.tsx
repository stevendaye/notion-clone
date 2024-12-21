import Image from "next/image";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import Link from "next/link";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2 w-full">
      <Link href={"/"} className="flex items-center gap-3">
        <Image
          src={"/logo.png"}
          width={40}
          height={40}
          alt="Logo"
          className="dark:hidden"
        />
        <Image
          src={"/logo-dark.png"}
          width={40}
          height={40}
          alt="Logo"
          className="hidden dark:block"
        />
        <p className={cn("font-semibold", font.className)}>Notion Clone</p>
      </Link>
    </div>
  );
};
