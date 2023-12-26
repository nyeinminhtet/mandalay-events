"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";

interface PaginationProps {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
}

const Pagination = ({
  urlParamName,
  page = 0,
  totalPages,
}: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleOnClick = (btnType: string) => {
    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageValue.toString(),
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex gap-2">
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        onClick={() => handleOnClick("prev")}
        disabled={Number(page) <= 1}
      >
        Prev
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        onClick={() => handleOnClick("next")}
        disabled={Number(page) >= totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
