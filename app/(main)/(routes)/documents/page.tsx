"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { handleToast } from "@/lib/toaster";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { CirclePlus } from "lucide-react";
import Image from "next/image";

const DocumentsPage = () => {
  const { user } = useUser();
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    const promise = create({ title: "Untitled" });

    handleToast(
      promise,
      "Creating a new note...",
      "New note created",
      "Failed to create a new note"
    );
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src={"/empty.png"}
        width={"300"}
        height={"300"}
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src={"/empty-dark.png"}
        width={"300"}
        height={"300"}
        alt="Empty"
        className="hidden dark:block"
      />

      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Notion Clone
      </h2>
      <Button onClick={onCreate}>
        <CirclePlus className="w-4 h-4 mr-2" />
        Create a Note
      </Button>
    </div>
  );
};

export default DocumentsPage;
