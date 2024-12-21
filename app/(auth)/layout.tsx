"use client";

import React from "react";
import { Footer } from "../(marketing)/_components/footer";
import { Navbar } from "../(marketing)/_components/navbar";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex flex-col dark:bg-[#1F1F1F]">
      <Navbar />

      <div className="h-full flex justify-center items-center pt-40">
        <div className="flex flex-col">
          <div className="md:h-auto md:w-[420px]">{children}</div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AuthLayout;
