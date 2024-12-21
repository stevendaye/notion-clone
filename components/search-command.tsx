"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { useSearch } from "@/hooks/use-search";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { File } from "lucide-react";

export const SearchCommand: React.FC = () => {
  const user = useQuery(api.users.currentUser);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const router = useRouter();
  const documents = useQuery(api.documents.getSeach);

  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);
  const toggle = useSearch((store) => store.toggle);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Open Search Modal with command ctrl+K
  useEffect(() => {
    const downKeyEvent = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", downKeyEvent);
    return () => document.removeEventListener("keydown", downKeyEvent);
  }, [toggle]);

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
  };

  // Avoiding hydration error
  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder={`Search ${user?.name}'s Notion Clone`}
      ></CommandInput>

      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((document) => (
            <CommandItem
              key={document._id}
              value={document._id}
              title={document.title}
              onSelect={onSelect}
              className="cursor-pointer"
            >
              {document.icon ? (
                <p className="mr-2 text-[18px]">{document.icon}</p>
              ) : (
                <File className="w-4 h-4 mr-2" />
              )}

              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
