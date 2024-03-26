import connectDB from "@/libs/connectDB";
import { Order } from "@/models/Order";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SK);

export async function POST(req) {
  await connectDB();

  const signature = await req.headers.get("stripe-signature");
  let event;

  if (!signature) {
    return Response.json("Bad request", {
      status: 400,
    });
  }

  try {
    const reqBuffer = await req.text();
    const signSecret = process.env.STRIPE_SIGN_SECRET;
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signSecret);
  } catch (e) {
    return Response.json(e, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const orderId = event?.data?.object?.metadata?.orderId;
    const isPaid = event?.data?.object?.payment_status === 'paid';
    if (isPaid) {
      await Order.updateOne({_id:orderId}, {paid:true});
    }
  }

  return Response.json({ received: true }, { status: 200 });

}
