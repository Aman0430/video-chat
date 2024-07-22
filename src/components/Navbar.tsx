import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

const Navbar = (props: Props) => {
  const user = auth();
  return (
    <header className="bg-primary text-secondary shadow-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between p-3 font-medium">
        <Link href="/" className="flex gap-2">
          New meeting <CalendarPlus />
        </Link>
        {user && (
          <div className="flex items-center gap-5">
            <Link href="/meetings">Meetings</Link>
            <UserButton />
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
