import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-gray-100">
            <div className="max-w-4xl w-full mx-auto h-24 flex items-center justify-center">
                <div>© 2023 <Link href={'https://github.com/ishiko732'}>ishiko</Link> All Rights Reserved</div>
            </div>
        </footer>
    );
};

export default Footer;