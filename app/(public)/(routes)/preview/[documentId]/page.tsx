"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Cover } from "@/components/cover";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  });
  const update = useMutation(api.documents.update);

  const onChange = (content: string) => {
    update({ id: params.documentId, content });
  };

  if (document === undefined) {
    return (
      <div className="">
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="w-[50%] h-14" />
            <Skeleton className="w-[80%] h-4" />
            <Skeleton className="w-[40%] h-4" />
            <Skeleton className="w-[60%] h-4" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return (
      <div className="flex flex-col items-start justify-center text-xl text-muted">
        <p className="font-extrabold">
          4<span>😧</span>4
        </p>{" "}
        Document not found
      </div>
    );
  }

  return (
    <div className="dark:bg-[#1F1F1F] pb-40">
      <Cover previewMode url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar previewMode initialData={document} />
        <Editor
          onChange={onChange}
          initialContent={document.content}
          editable={false}
        />
      </div>
    </div>
  );
};

export default DocumentIdPage;
