"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "@/components/ui/skeleton";

interface CoverProps {
  url?: string;
  previewMode?: boolean;
}

export const Cover = ({ url, previewMode }: CoverProps) => {
  const params = useParams();
  const coverImage = useCoverImage();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);

  const { edgestore } = useEdgeStore();

  const onRemove = async () => {
    if (url) {
      console.log("url:", url);

      await edgestore.publicFiles.delete({
        url,
      });
    }

    removeCoverImage({ id: params.documentId as Id<"documents"> });
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[7vh]",
        url && "bg-muted"
      )}
    >
      {!!url && <Image src={url} fill className="object-cover" alt="Cover" />}

      {url && !previewMode && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => coverImage.onReplace(url)}
            variant={"outline"}
            size={"sm"}
            className="text-muted-foreground text-xs"
          >
            <ImageIcon className="w-4 h-4 mr-2" /> Change cover
          </Button>

          <Button
            onClick={onRemove}
            variant={"outline"}
            size={"sm"}
            className="text-muted-foreground text-xs"
          >
            <X className="w-4 h-4 mr-2" /> Remove
          </Button>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-full h-[35vh]" />;
};
