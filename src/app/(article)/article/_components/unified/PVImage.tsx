import splitWords from "@/service/analyzer/en_US";
import PVSpan from "@/app/(article)/article/_components/unified/PVSpan";

export default function PVImage({ src, alt, style, className, children }: any) {
  const spans = splitWords(alt);
  return (
    <div className={"sm:flex justify-center items-center flex-col"}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={alt} src={src} style={style} className={className}>
        {children}
      </img>
      <div>
        {spans.map((ceil, index) => (
          <PVSpan key={`img-${alt}-${index}`} className={"note"}>
            {ceil}
          </PVSpan>
        ))}
      </div>
    </div>
  );
}
