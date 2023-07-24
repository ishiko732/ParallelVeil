import {NextApiRequest, NextApiResponse} from "next";
import {findNote_by_nid as findNote} from "@/service/db/note";

export default async function handler(req: NextApiRequest,
                                      res: NextApiResponse) {
    const {nid} = req.query
    if (req.method === 'GET' && typeof nid === 'string') {
        res.status(200).json(await findNote({
            nid: nid
        }))
    }
    res.status(400)
}