import React from "react";
import Image from "next/image";
import Link from "next/link";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import NavItems from "./NavItems";
import { Button } from "../ui/button";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <header className="w-full border-b bg-secondary sticky top-0 z-20">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className=" flex items-center gap-2">
          <Image
            src="/assets/logo.svg"
            width={38}
            height={38}
            alt="logo svg"
            className="object-cover object-center"
          />
          <div className="hidden md:flex tracking-tighter font-semibold  text-muted-foreground">
            <p className="first-letter:text-2xl first-letter:text-primary -mb-3">
              Mandaly
            </p>
            <span className="first-letter:text-2xl first-letter:text-primary">
              Events
            </span>
          </div>
        </Link>

        <SignedIn>
          <nav className="md:flex-between hidden w-full max-w-xs">
            <NavItems />
          </nav>
        </SignedIn>

        <div className="flex w-32 justify-end gap-3">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            <MobileNav />
          </SignedIn>
          <SignedOut>
            <Button asChild className="rounded-full font-semibold" size="lg">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};
export default Header;
