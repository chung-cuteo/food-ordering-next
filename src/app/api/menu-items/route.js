import { isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { MenuItem } from "@/models/MenuItem";
import connectDB from "@/libs/connectDB";

export async function POST(req) {
  await connectDB();
  const data = await req.json();

  if (!data) throw Error("miss properties");
  if (!(await isAdmin())) throw Error("unauthorized !!");

  const menuItemCreated = await MenuItem.create(data);
  if (menuItemCreated) return Response.json(menuItemCreated);
  return Response.json({});
}

export async function PUT(req) {
  await connectDB();
  const { _id, ...data } = await req.json();

  if (_id || !data) throw Error("miss properties");
  if (!(await isAdmin())) throw Error("unauthorized !!");

  const updatedMenuItem = await MenuItem.findByIdAndUpdate(_id, data);

  if (updatedMenuItem) return Response.json(true);

  return Response.json(false);
}

export async function GET() {
  await connectDB();

  const menuItems = await MenuItem.find();
  if (menuItems) return Response.json(menuItems);
  return Response.json({});
}

export async function DELETE(req) {
  await connectDB();
  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");
  console.log(_id );

  if (!_id) throw Error("miss properties");
  if (!(await isAdmin())) throw Error("unauthorized !!");

  const deletedMenuItem = await MenuItem.deleteOne({ _id });
  if (deletedMenuItem) return Response.json(true);

  return Response.json(false);
}
