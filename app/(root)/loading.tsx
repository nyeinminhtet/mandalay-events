import React from "react";
import Image from "next/image";

const Loader = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-primary">
      <Image
        src="/assets/icons/spinner.svg"
        alt="loader image"
        width={50}
        height={50}
      />
    </div>
  );
};

export default Loader;
