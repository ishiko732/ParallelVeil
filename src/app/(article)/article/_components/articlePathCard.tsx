import Image from 'next/image';
import Link from 'next/link';
import {FilePath} from "@@/collect/system/src/FileStores";


const ArticlePathCard = ({articlePath}: { articlePath: FilePath }) => {
    return (
        <Link href={`article/${articlePath.route}`} legacyBehavior>
            <a className={'pr-4'}>
                <div className="border rounded-lg">
                    <Image
                        src={`/next.svg`}
                        width={1200}
                        height={700}
                        alt={articlePath.name}
                    />
                </div>
                <div className="px-2 py-4">
                    <h1 className={"font-bold text-lg"}>{articlePath.file ? articlePath.name : `GO TO ${articlePath.name}`}</h1>
                    {/*<span>{post.frontMatter.date}</span>*/}
                </div>
            </a>
        </Link>
    );
};

export default ArticlePathCard;