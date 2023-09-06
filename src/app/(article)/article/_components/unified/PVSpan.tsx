"use client";
import { loggerDebug } from "@/config/pinoConfig";
import styled from "styled-components";
import { CSSProperties } from "react";

export default function PVSpan({ children, className, style }: any) {
  loggerDebug("pvSpan", { children, className, style });
  return (
    <SpanAfter className={className} style={style}>
      {children}
    </SpanAfter>
  );
}

const SpanAfter = styled.span<{ style?: CSSProperties; className?: string }>`
  &:after {
    content: " ";
    white-space: nowrap;
  }
`;
