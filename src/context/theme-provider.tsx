"use client";

import { createContext, useState } from "react";
import { PageProps } from "@/types/react";

export const ThemeContext = createContext({});

export default function ThemeProvider({ children }: PageProps) {
  const [mode, setMode] = useState("light");
  return (
    <ThemeContext.Provider value={"dark"}>{children}</ThemeContext.Provider>
  );
}
