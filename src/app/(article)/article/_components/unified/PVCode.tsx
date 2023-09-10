import "highlight.js/styles/default.css";

export default function PVCode({ children, style, className }: any) {
  return (
    <code className={className} style={style}>
      {children}
    </code>
  );
}
