"use client";
import Link from "next/link";
import { loggerDebug } from "@/config/pinoConfig";

export default function MyLink({ children, href }: any) {
  loggerDebug("mylink", href);
  return (
    <Link href={href} scroll={false}>
      {children}
    </Link>
  );
}
