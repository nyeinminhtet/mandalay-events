"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "../ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

const Search = ({
  placeholder = "ခေါင်းစဥ်ဖြင့်ရှာရန်...",
}: {
  placeholder?: string;
}) => {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const dealyDebounceFn = setTimeout(() => {
      let newUrl = "";
      if (query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: query,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["query"],
        });
      }

      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(dealyDebounceFn);
  }, [query, searchParams, router]);

  return (
    <div className="flex-center min-h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
      <Image
        src="/assets/icons/search.svg"
        alt="search icon"
        width={24}
        height={24}
      />
      <Input
        type="text"
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        className="p-regular-16 border-0 shadow-none bg-grey-50 outline-offset-0 placeholder:text-grey-500 focus:border-0
         focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};

export default Search;
