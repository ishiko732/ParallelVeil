import Image from 'next/image';
//略
export default function MyImage({src, alt}: any) {
    return <Image src={"/vercel.svg"} alt={alt} width="1200" height="700"/>;
};