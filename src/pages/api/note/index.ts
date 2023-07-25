import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // if (req.method === 'GET') {
    //     findNote()
    //     res.status(200).json(posts)
    // } else if (req.method === 'POST') {
    //     const { title, content, authorId } = req.body
    //     const post = await prisma.post.create({
    //         data: {
    //             title,
    //             content,
    //             authorId,
    //         },
    //     })
    //     res.status(200).json(post)
    // } else if (req.method === 'PUT') {
    //     const { id, title, content } = req.body
    //     const post = await prisma.post.update({
    //         where: { id },
    //         data: {
    //             title,
    //             content,
    //         },
    //     })
    //     res.status(200).json(post)
    // } else if (req.method === 'DELETE') {
    //     const { id } = req.body
    //     await prisma.post.delete({
    //         where: { id },
    //     })
    //     res.status(200).end()
    // } else {
    //     res.status(405).end()
    // }
    res.status(400)
}