"use client";

import React, { ElementRef, useRef, useState } from "react";

import { IconPicker } from "./icon-picker";
import { Button } from "@/components/ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { useCoverImage } from "@/hooks/use-cover-image";

interface ToolbarProps {
  initialData: Doc<"documents">;
  previewMode?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  initialData,
  previewMode,
}) => {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(initialData.title);

  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);

  const coverImage = useCoverImage();

  const enableInput = () => {
    if (previewMode) return;

    setIsEditing(true);
    setTimeout(() => {
      setTitle(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onInput = (value: string) => {
    setTitle(value);
    update({ id: initialData._id, title: value ?? "Untitled" });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  /* Emoji icon selection */
  const onSelectIcon = (icon: string) => {
    update({
      id: initialData._id,
      icon,
    });
  };

  const onRemoveIcon = () => {
    removeIcon({ id: initialData._id });
  };

  return (
    <div className="pl-[54px] group relative">
      {/* # Render document's icon if exist & is not in previewMode mode
          # while allowing the author to pick a new icon
      */}
      {!!initialData.icon && !previewMode && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onSelectIcon}>
            <p className="text-6xl hover:opacity-75 transition">
              {initialData.icon}
            </p>
          </IconPicker>

          <Button
            size={"icon"}
            variant={"outline"}
            className="rounded-full opacity-0  group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            onClick={onRemoveIcon}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Render Document's icon if exists & is in previewMode mode */}
      {!!initialData.icon && previewMode && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}

      {/* # Allow the author to pick/add an icon if there is no icon
          # & is not in previewMode mode
      */}
      <div className="flex items-center opacity-0 group-hover:opacity-100 gap-x-1 py-4">
        {!initialData.icon && !previewMode && (
          <IconPicker asChild onChange={onSelectIcon}>
            <Button
              size={"sm"}
              variant={"outline"}
              className="text-muted-foreground text-xs"
            >
              <Smile className="w-4 h-4 mr-2" /> Add icon
            </Button>
          </IconPicker>
        )}

        {!initialData.coverImage && !previewMode && (
          <Button
            size={"sm"}
            variant={"outline"}
            className="text-muted-foreground text-xs"
            onClick={coverImage.onOpen}
          >
            <ImageIcon className="w-4 h-4 mr-2" /> Add cover
          </Button>
        )}
      </div>

      {isEditing && !previewMode ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={title}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
        />
      ) : (
        <div
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
          role="button"
          onKeyDown={() => {}}
          tabIndex={0}
          onClick={enableInput}
        >
          {initialData.title}
        </div>
      )}
    </div>
  );
};
