"use client";

import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useSettings } from "@/hooks/use-settings";
import { Label } from "../ui/label";
import { ModeToggle } from "@/components/mode-toggle";

export const SettingsModal: React.FC = () => {
  const isOpen = useSettings((store) => store.isOpen);
  const onClose = useSettings((store) => store.onClose);
  const toggle = useSettings((store) => store.toggle);

  // Open Settings Modal with command ctrl+M
  useEffect(() => {
    const downKeyEvent = (e: KeyboardEvent) => {
      if (e.key === "m" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", downKeyEvent);
    return () => document.removeEventListener("keydown", downKeyEvent);
  }, [toggle]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My settings</h2>
        </DialogHeader>

        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-y-1">
            <Label>Appearence</Label>

            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Notion Clone looks on your device
            </span>
          </div>

          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
};
