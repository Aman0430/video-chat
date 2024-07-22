"use client";

import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function ErrorPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center rounded-md bg-primary-foreground antialiased">
      <div className="mx-auto max-w-2xl p-4">
        <h1 className="relative z-10 bg-gradient-to-b from-neutral-400  to-neutral-600 bg-clip-text text-center font-sans text-lg  font-bold text-transparent md:text-7xl">
          404 Error
        </h1>
        <p></p>
        <p className="relative z-10 mx-auto my-2 max-w-lg text-center text-sm text-neutral-500">
          You have reached a page that does not exist.
        </p>
      </div>
      <BackgroundBeams />
    </div>
  );
}
