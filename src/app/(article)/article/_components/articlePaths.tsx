import { FilePath } from "@@/collect/system/src/FileStores";
import ArticlePathCard from "@/app/(article)/article/_components/articlePathCard";

export default function ArticlePaths(params: { articlePaths: FilePath[] }) {
  const { articlePaths } = params;
  return (
    <div className="grid gap-4 grid-cols-3 pt-4">
      {articlePaths.map((articleData) => (
        <ArticlePathCard
          key={"paths" + articleData.name}
          articlePath={articleData}
        />
      ))}
    </div>
  );
}
