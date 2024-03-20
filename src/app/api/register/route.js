import { User } from "@/models/User";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    mongoose.connect(process.env.MONGO_URL);

    const pass = body.password;
    const email = body.email;

    if (!pass?.length || pass.length < 5) {
      new Error("password must be at least 5 characters");
    }

    const checkExitEmail = User.findOne({ email }).lean();

    if (checkExitEmail) {
      const data = {
        status: 400,
        message: "Username or email already exists",
        metadata: [],
      };
      return Response.json(data);
    }

    const salt = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(pass, salt);

    const createdUser = await User.create(body);

    const cloneCreatedUser = [...createdUser];
    delete cloneCreatedUser.password;

    const data = {
      status: 201,
      message: "Username or email already exists",
      metadata: cloneCreatedUser,
    };

    return Response.json(data);
  } catch (error) {
    const data = {
      status: 400,
      message: "error",
      metadata: [],
    };
    return Response.json(data);
  }
}
