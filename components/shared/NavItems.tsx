"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { headerLinks } from "@/constants";

const NavItems = () => {
  const pathName = usePathname();

  return (
    <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
      {headerLinks.map((item) => {
        const isActive = pathName === item.route;
        return (
          <li
            key={item.label}
            className={`${
              isActive ? "text-primary-500" : "text-muted-foreground"
            } flex-center p-medium-16 whitespace-normal hover:text-primary-500`}
          >
            <Link href={item.route}>{item.label}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
