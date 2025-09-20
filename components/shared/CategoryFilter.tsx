"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from "@/lib/actions/category.action";
import { ICategory } from "@/lib/database/models/category.model";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

const CategoryFilter = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const getCategories = async () => {
      const categoriesList = await getAllCategories();

      categoriesList && setCategories(categoriesList as ICategory[]);
    };

    getCategories();
  }, []);

  const onSelectCategory = (category: string) => {
    let newUrl = "";
    if (category && category !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "category",
        value: category,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["category"],
      });
    }
    router.push(newUrl, { scroll: false });
  };

  return (
    <Select onValueChange={(value: string) => onSelectCategory(value)}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="အမျိုးအစား" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All" className="select-item p-regular-14">
          All
        </SelectItem>

        {categories.map((category) => (
          <SelectItem
            value={category.name}
            key={category._id}
            className="select-item p-regular-14"
          >
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoryFilter;
