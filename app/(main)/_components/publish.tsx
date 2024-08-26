"use client";

import { useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useOrigin } from "@/hooks/use-origin";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { handleToast } from "@/lib/toaster";
import { Button } from "@/components/ui/button";
import { Check, Copy, Globe } from "lucide-react";

interface PusblishProps {
  initialData: Doc<"documents">;
}

export const Publish: React.FC<PusblishProps> = ({ initialData }) => {
  const origin = useOrigin();
  const update = useMutation(api.documents.update);

  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  //URL to view a document by the pucblic
  const url = `${origin}/preview/${initialData._id}`;
  const resetTime = 2000;

  const onPublish = () => {
    setIsSubmitting(true);
    const promise = update({ id: initialData._id, isPublished: true }).finally(
      () => {
        setIsSubmitting(false);
      }
    );

    handleToast(
      promise,
      "Publishing note...",
      "Note published",
      "Failed to publish note"
    );
  };

  const onUnPublish = () => {
    setIsSubmitting(true);
    const promise = update({ id: initialData._id, isPublished: false }).finally(
      () => {
        setIsSubmitting(false);
      }
    );

    handleToast(
      promise,
      "Unpublishing note...",
      "Note unpublished",
      "Failed to unpublish note"
    );
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, resetTime);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={"sm"} variant={"ghost"}>
          Publish{" "}
          {initialData.isPublished && (
            <Globe className="w-4 h-4 ml-2 text-sky-500" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="w-4 h-4 text-sky-500 animate-pulse" />
              <p className="text-xs font-medium text-sky-500">
                This note is live to the public
              </p>
            </div>

            <div className="flex items-center">
              <input
                value={url}
                disabled
                className="flex-1 text-xs px-2 border rounded-l-md h-8 bg-muted truncate"
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            <Button
              size={"sm"}
              className="w-full text-xs"
              disabled={isSubmitting}
              onClick={onUnPublish}
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <Globe className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-2">Publish this note</p>
            <span className="text-xs text-muted-foreground mb-4">
              Share your ideas with others
            </span>
            <Button
              disabled={isSubmitting}
              size={"sm"}
              className="w-full text-xs"
              onClick={onPublish}
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
