import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

export const Footer = () => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center w-full px-6 py-4 bg-background z-50 dark:bg-[#1F1F1F]">
        <Logo />
        <div className="md:ml-auto w-full flex justify-between md:justify-end items-center gap-x-2">
          <Button variant={"ghost"} size={"sm"}>
            Privacy Policy
          </Button>
          <Button variant={"ghost"} size={"sm"}>
            Terms & Conditions
          </Button>
        </div>
      </div>

      <p className="text-xs flex items-start justify-center w-full py-5">
        Made with ❤️ by Steven Audrey Daye
      </p>
    </div>
  );
};
