import connectDB from "@/libs/connectDB";
import { isAdmin } from "../auth/[...nextauth]/route";
import { Category } from "@/models/Category";

export async function POST(req) {
  await connectDB();
  const { name } = await req.json();
  if (!name) throw Error("name is required !");

  if (!(await isAdmin())) throw Error("unauthorized !!");
  const categoryCreate = await Category.create({ name });
  if (categoryCreate) return Response.json(categoryCreate);
  return Response.json({});
}

export async function PUT(req) {
  await connectDB();

  const { _id, name } = await req.json();

  if (!_id || !name) throw Error("miss properties");
  if (!(await isAdmin())) throw Error("unauthorized !!");

  const updatedData = await Category.updateOne({ _id }, { name });
  if (updatedData) return Response.json({ _id });

  return Response.json(false);
}

export async function GET() {
  await connectDB();
  const categories = await Category.find().lean();

  if (categories.length > 0) return Response.json(categories);
  return Response.json({});
}

export async function DELETE(req) {
  await connectDB();
  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");

  if (!_id || !url) throw Error("miss properties");
  if (!(await isAdmin())) throw Error("unauthorized !!");

  const deletedData = await Category.deleteOne({ _id });
  if (deletedData) return Response.json({ _id });

  return Response.json(false);
}
