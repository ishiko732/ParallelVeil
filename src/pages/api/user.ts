import {NextApiRequest, NextApiResponse} from "next";
import users from "@@/mock/users";

type IUserData = {
    id: number,
    age: number,
    name: string,
    email: string
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<IUserData[]>) {
    res.status(200).json(users)
}
