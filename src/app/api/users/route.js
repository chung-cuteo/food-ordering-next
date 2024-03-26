import connectDB from "@/libs/connectDB";
import { User } from "@/models/User";

export async function GET() {
  await connectDB();

  const users =  await User.find();
  if (users) {
    return Response.json(users);
  }

  return Response.json([]);
}
