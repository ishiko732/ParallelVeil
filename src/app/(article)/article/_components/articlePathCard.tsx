import Image from "next/image";
import Link from "next/link";
import { FilePath } from "@@/collect/system/src/FileStores";

const ArticlePathCard = ({ articlePath }: { articlePath: FilePath }) => {
  return (
    <Link href={`article/${articlePath.route}`} legacyBehavior>
      <a className={"pr-4"}>
        <div className="border">
          <Image
            src={"https://dummyimage.com/420x260"}
            alt={articlePath.name}
            className="object-cover object-center w-full h-full block"
            height={420}
            width={260}
          />
        </div>
        <div className="px-2 py-4">
          <h1 className={"font-bold text-lg dark:text-white"}>
            {articlePath.file ? articlePath.name : `GO TO ${articlePath.name}`}
          </h1>
          {/*<span>{post.frontMatter.date}</span>*/}
        </div>
      </a>
    </Link>
  );
};

export default ArticlePathCard;