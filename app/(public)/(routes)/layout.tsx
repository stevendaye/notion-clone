"use client";

import React from "react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return <div className="h-full dark:bg-[#1F1F1F]">{children}</div>;
};

export default PublicLayout;
