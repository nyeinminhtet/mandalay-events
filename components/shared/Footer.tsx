import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-primary">
      <div className="flex-center  wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
        <Link href="/">
          <Image
            src="/assets/logo.svg"
            alt="logo"
            className="bg-white rounded-full"
            width={38}
            height={38}
          />
        </Link>

        <p className=" text-xs text-secondary sm:text-base">
          Copyright&copy; 2023{" "}
          <span className="text-muted-foreground">Mandalay Events</span> . All
          Rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
