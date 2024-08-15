"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { handleToast } from "@/utils/toaster";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import React from "react";

interface BarnerProps {
  documentId: Id<"documents">;
}

export const Barner: React.FC<BarnerProps> = ({ documentId }) => {
  const router = useRouter();
  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  const onRemove = () => {
    const promise = remove({ id: documentId });

    handleToast(
      promise,
      "Deleting note...",
      "Note deleted",
      "Failed to delete note"
    );

    router.push("/documents");
  };

  const onRestore = () => {
    const promise = restore({ id: documentId });

    handleToast(
      promise,
      "Restoring document",
      "Document restored",
      "Failed to restore document"
    );
  };

  return (
    <div className="flex justify-center items-center w-full bg-rose-500 text-center text-sm p-2 text-white gap-x-2">
      <p className="font-normal">This page is in th trash</p>

      <Button
        size={"sm"}
        onClick={onRestore}
        variant={"outline"}
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
      >
        Restore page
      </Button>

      <ConfirmModal onConfirm={onRemove}>
        <Button
          size={"sm"}
          variant={"outline"}
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        >
          Delete permanently
        </Button>
      </ConfirmModal>
    </div>
  );
};
