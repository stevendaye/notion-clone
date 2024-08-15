"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { handleToast } from "@/utils/toaster";
import { useMutation, useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export const TrashBox: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  const [search, setSearch] = useState<string>("");

  const filteredDocuments = documents?.filter((document) =>
    document.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    documentId: Id<"documents">
  ) => {
    event.stopPropagation();
    const promise = restore({ id: documentId });

    handleToast(
      promise,
      "Restoring note...",
      "Note restored",
      "Failed to restore note"
    );
  };

  const onRemove = (documentId: Id<"documents">) => {
    const promise = remove({ id: documentId });

    handleToast(
      promise,
      "Deleting note...",
      "Note Deleted",
      "Failed to delete note"
    );

    router.push("/documents");
  };

  if (documents === undefined) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="w-4 h-4 " />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title"
        />
      </div>

      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No document found
        </p>
        {filteredDocuments?.map((document) => (
          <div key={document._id}>
            <button
              className="flex justify-between text-sm rounded-sm w-full hover:bg-primary/5 items-center text-primary"
              onClick={() => onClick(document._id)}
            >
              <span className="truncate pl-2">{document.title}</span>
              <div className="flex items-center">
                <button
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                  onClick={(e) => onRestore(e, document._id)}
                >
                  <Undo className="w-4 h-4 text-muted-foreground" />
                </button>

                <ConfirmModal onConfirm={() => onRemove(document._id)}>
                  <button className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600">
                    <Trash className="w-4 h-4 text-muted-foreground" />
                  </button>
                </ConfirmModal>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
