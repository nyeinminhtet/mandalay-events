import React from "react";

import Search from "./Search";
import CategoryFilter from "./CategoryFilter";

const SearchAndFilter = () => {
  return (
    <div className="flex w-full flex-col gap-5 md:flex-row">
      <Search />
      <CategoryFilter />
    </div>
  );
};

export default SearchAndFilter;
