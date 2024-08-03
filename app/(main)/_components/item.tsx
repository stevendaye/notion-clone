"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";

interface ItemProps {
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  label: string;
  icon: LucideIcon;
  onExpand?: () => void;
  onClick: () => void;
}

export const Item = ({
  id,
  documentIcon,
  active,
  expanded,
  isSearch,
  level = 0,
  label,
  icon: Icon,
  onExpand,
  onClick,
}: ItemProps) => {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
  const router = useRouter();
  const { user } = useUser();

  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);

  const handleExpand = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const handleToast = (
    promise: Promise<void | null>,
    loading: string,
    success: string,
    error: string
  ) => {
    toast.promise(promise, {
      loading,
      success,
      error,
    });
  };

  const onCreate = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();

    if (!id) return;

    const promise = create({ title: "Untitled", parentDocument: id }).then(
      (documentId) => {
        if (!expanded) onExpand?.();
        // router.push(`/documents/${documentId}`);
      }
    );

    handleToast(
      promise,
      "Creating a new note",
      "New note created",
      "Failed to create a new note"
    );
  };

  const onArchive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    if (!id) return;

    const promise = archive({ id });

    handleToast(
      promise,
      "Moving note to trash",
      "Moved note to trash",
      "Failed to move note to trash"
    );
  };

  return (
    <div
      className={cn(
        "flex min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
    >
      {!!id && (
        <button
          className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
          onClick={handleExpand}
        >
          <ChevronIcon className="w-4 h-4 shrink-0 text-muted-foreground/50" />
        </button>
      )}

      <button
        onClick={onClick}
        aria-label="Create Note"
        className="flex items-center group w-full"
      >
        {documentIcon ? (
          /* Custom Icon */
          <div className="shrink-0 h-18px mr-2 text-muted-foreground">
            {documentIcon}
          </div>
        ) : (
          /* Default Icon */
          <Icon className="h-[18px] mr-2 shrink-0 text-muted-foreground" />
        )}
        <span className="truncate">{label}</span>

        {isSearch && (
          <kbd
            className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border
            bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
          >
            <span className="text-xs">⌘</span>K
          </kbd>
        )}
        {!!id && (
          <div className="flex ml-auto items-center gap-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <button
                  aria-label="Archive Document"
                  className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm
                  hover:bg-neutral-300 dark:hover:bg-neutral-600"
                >
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-60"
                align="start"
                side="right"
                forceMount
              >
                <DropdownMenuItem onClick={onArchive}>
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="text-xs text-muted-foreground p-2">
                  Last Edited by: {user?.fullName}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300
              dark:hover:bg-neutral-600"
              onClick={onCreate}
            >
              <Plus className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}
      </button>
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : "12px",
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="w-4 h-4" />
      <Skeleton className="w-[30%] h-4" />
    </div>
  );
};
