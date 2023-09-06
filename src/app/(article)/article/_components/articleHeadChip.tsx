import React, { ReactNode } from "react";

export default function ArticleHeadChip({ children }: { children: ReactNode }) {
  return (
    <span
      className={
        "px-2 py-1 text-sm font-medium text-black bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300 mx-2 focus:cursor-auto"
      }
    >
      {children}
    </span>
  );
}
