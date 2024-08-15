"use client";

import { cn } from "@/lib/utils";

import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { ElementRef, useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useMutation } from "convex/react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { api } from "@/convex/_generated/api";
import { UserItem } from "./user-item";
import { Item } from "./item";
import { DocumentList } from "./document-list";
import { handleToast } from "@/utils/toaster";
import { TrashBox } from "./trash-box";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { Navbar } from "./navbar";

export const Navigation: React.FC = () => {
  const search = useSearch();
  const settings = useSettings();

  const isMobile = useMediaQuery("(max-width: 768px)");
  const pathname = usePathname();
  const params = useParams();

  const create = useMutation(api.documents.create);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const animationTime = 300;
  const trashRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let maxWidth = event.clientX;

    if (maxWidth < 240) maxWidth = 240;
    if (maxWidth > 480) maxWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${maxWidth}px`;
      navbarRef.current.style.setProperty("left", `${maxWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${maxWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");

      setTimeout(() => setIsResetting(false), animationTime);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");

      setTimeout(() => setIsResetting(false), animationTime);
    }
  };

  const handleCreate = useCallback(() => {
    const promise = create({ title: "Untitled" });

    handleToast(
      promise,
      "Creating a new note",
      "New note created",
      "Failed to create a new note"
    );
  }, [create]);

  // Create New Page with command ctrl+i;
  useEffect(() => {
    const keydownEvent = (e: KeyboardEvent) => {
      if (e.key === "i" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleCreate();
      }
    };

    document.addEventListener("keydown", keydownEvent);
    return () => document.removeEventListener("keydown", keydownEvent);
  }, [handleCreate]);

  // Open Trash Popup on command ctrl+b
  useEffect(() => {
    const keydownEvent = (e: KeyboardEvent) => {
      if (e.key === "b" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        trashRef.current?.click();
      }
    };

    document.addEventListener("keydown", keydownEvent);
    return () => document.removeEventListener("keydown", keydownEvent);
  }, []);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
    /* trunk-ignore(eslint/react-hooks/exhaustive-deps) */
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar flex flex-col h-full bg-secondary relative overflow-y-auto w-60 z-[9999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <button
          className={cn(
            `absolute top-3 right-2 w-6 h-6 text-muted-foreground rounded-sm hover:bg-neutral-300
            dark:hover:bg-neutral-600 opacity-0 group-hover/sidebar:opacity-100 transition`,
            isMobile && "opacity-100"
          )}
          aria-label="Collapse Sidebar"
          onClick={collapse}
        >
          <ChevronsLeft className="w-6 h-6" />
        </button>

        <div>
          <UserItem />
          <Item
            onClick={search.onOpen}
            label={"Search"}
            isSearch
            icon={Search}
          />
          <Item
            onClick={settings.onOpen}
            label={"Settings"}
            isSettings
            icon={Settings}
          />
          <Item
            onClick={handleCreate}
            label={"New Page"}
            isNewPage
            icon={PlusCircle}
          />
        </div>

        <div className="mt-4">
          <DocumentList />

          <Item onClick={handleCreate} label="Add a page" icon={Plus} />
          <Popover>
            <PopoverTrigger className="w-full mt-4" ref={trashRef}>
              <Item label="Trash" isTrash icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              side={isMobile ? "bottom" : "right"}
              className="w-72 p-0"
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>

        <button
          aria-label="Resize Sidebar"
          onMouseDown={handleMouseDown}
          className="absolute opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize
          right-0 top-0 w-1 bg-primary/10 h-full"
          onClick={resetWidth}
        />
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        {params.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {isCollapsed && (
              <button
                aria-label="Expand Sidebar"
                className="w-6 h-6 text-muted-foreground"
                onClick={resetWidth}
              >
                <MenuIcon />
              </button>
            )}
          </nav>
        )}
      </div>
    </>
  );
};
