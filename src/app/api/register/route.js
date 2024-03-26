import { User } from "@/models/User";
import connectDB from "@/libs/connectDB";
import bcrypt from "bcrypt";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { password, email } = body;

    if (!password) {
      new Error("Password is required");
    }

    const salt = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(password, salt);

 
    const checkExitEmail = await User.findOne({ email }).lean();

    if (checkExitEmail) {
      return Response.json("Username or email already exists", { status: 400 });
    }

    const createdUser = await User.create(body);
    return Response.json(createdUser, { status: 201 });

  } catch (error) {
    return Response.json(error, { status: 402 });
  }
}
