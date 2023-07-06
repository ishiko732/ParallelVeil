import {NextApiRequest, NextApiResponse} from "next";
import tokenizer from "@/service/kuromoji";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    const text = req.query.text as string | null;
    if (typeof text === "string") {
        tokenizer()
            .then(_tokenizer => res.status(200).json(_tokenizer.tokenize(text)))
            .catch(() => res.status(400).json(""))
    } else {
        res.status(404).json("")
    }
}
