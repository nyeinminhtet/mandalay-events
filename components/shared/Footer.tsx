import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t bg-primary-50">
      <div className="flex-center  wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
        <Link href="/" className="bg-zinc-50  rounded-full">
          <Image src="/assets/logo.svg" alt="logo" width={38} height={38} />
        </Link>

        <p className="text-secondary">
          Copyright&copy; 2023{" "}
          <span className="text-green-600">Mandalay Events</span> . All Rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
