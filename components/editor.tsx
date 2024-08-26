"use client";

import React, { useCallback, useEffect } from "react";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor: React.FC<EditorProps> = ({
  onChange,
  initialContent,
  editable,
}) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleMediaUpload = async (file: File) => {
    const res = await edgestore.publicFiles.upload({ file });
    return res.url;
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleMediaUpload,
  });

  // Debounce content update request
  const debounce = useCallback(
    (callback: (...args: any[]) => void, waitTime: number) => {
      let timer: NodeJS.Timeout;
      return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          callback(...args);
        }, waitTime);
      };
    },
    []
  );

  useEffect(() => {
    const wait: number = 3000;
    const handleEditorContentChange = () => {
      onChange(JSON.stringify(editor.document, null, 2));
    };

    const debounceContentChange = debounce(handleEditorContentChange, wait);

    editor.onChange(debounceContentChange);

    return () => {
      editor.onChange(() => {});
    };
  }, [editor, onChange, debounce]);

  return (
    <div className="h-full">
      <BlockNoteView
        editable={editable}
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Editor;
