import users from "@@/mock/users";
import {NextRequest, NextResponse} from "next/server";

type IUserData = {
    id: number,
    age: number,
    name: string,
    email: string
}

export async function GET(request: NextRequest) {
    return NextResponse.json(users, {status: 200})
}