import React from "react";

import Image from "next/image";
import NavItems from "./NavItems";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const MobileNav = () => {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger className="aligh-middle">
          <Image
            src="/assets/icons/menu.svg"
            alt="mobile menu"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-6 bg-white md:hidden">
          <Image
            src="/assets/logo.svg"
            alt="logo"
            width={38}
            height={38}
            className="38"
          />
          <Separator className="border border-gray-50" />
          <NavItems />
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
