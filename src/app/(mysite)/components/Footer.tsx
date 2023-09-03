import Link from "next/link";
import Github from "@/app/(mysite)/components/Github";
import PVICO from "@/app/(mysite)/components/PVICO";

const Footer = () => {
  return (
    <footer className="text-gray-600 body-font drak:text-white-600 dark:bg-slate-800">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <PVICO />
        <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          © 2023 Parallel Veil —
          <Link href={`https://github.com/ishiko732`} target={"_blank"}>
            {" "}
            @ishiko732
          </Link>
        </p>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          <Github name={"ishiko732"} />
        </span>
      </div>
    </footer>
  );
};

export default Footer;