import { Button } from "@/components/ui/button";

export const Footer: React.FC = () => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center w-full px-6 py-4 bg-background z-50 dark:bg-[#1F1F1F]">
        <div className="hidden md:flex items-center gap-x-2 w-full">
          <Button variant={"ghost"} size={"sm"}>
            🫂 About us
          </Button>
          <Button variant={"ghost"} size={"sm"}>
            📆 Calendar
          </Button>
        </div>
        <div className="md:ml-auto w-full flex justify-between md:justify-end items-center gap-x-2">
          <Button variant={"ghost"} size={"sm"}>
            Privacy Policy
          </Button>
          <Button variant={"ghost"} size={"sm"}>
            Terms & Conditions
          </Button>
        </div>
      </div>

      <p className="text-xs flex items-center justify-center w-full py-5">
        Lighweight Notion clone made with ❤️ by Steven Audrey Daye 🇧🇯
      </p>
    </div>
  );
};
