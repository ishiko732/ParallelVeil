import {NextApiRequest, NextApiResponse} from "next";
import tokenizer from "@/service/kuromoji";
import {IpadicFeatures} from "kuromoji";

/**
 * github : https://github.com/takuyaa/kuromoji.js
 * NPM : https://www.npmjs.com/package/kuromoji
 * LICENSE : Apache-2.0
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<IpadicFeatures[]>) {
    const text: string = req.query.text ?? (req.body?.text ?? '');
    tokenizer()
        .then(_tokenizer => res.status(200).json(_tokenizer.tokenize(text)))
        .catch(() => res.status(400))
}
