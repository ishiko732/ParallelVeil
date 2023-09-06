"use client";
import { loggerDebug } from "@/config/pinoConfig";
import Link from "next/link";

export default function PVListDisc({ children, style, className }: any) {
  // loggerDebug("Myul",{ children, style, className });
  return <ul className={"list-disc"}>{children}</ul>;
}
