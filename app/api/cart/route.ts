// app/api/cart/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Cart } from "@/app/models/Cart";
import { getSessionId } from "@/lib/sessionId";

// GET cart
export async function GET() {
  await connectDB();
  const sessionId = await getSessionId();

  let cart = await Cart.findOne({ sessionId });
  if (!cart) {
    cart = await Cart.create({ sessionId, items: [] });
  }

  return NextResponse.json({ items: cart.items });
}

// POST add item
export async function POST(req: Request) {
  try {
    await connectDB();
    const sessionId = await getSessionId();
    const { slug, title, price, options } = await req.json();

    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = await Cart.create({ sessionId, items: [] });
    }

    // Check if same item + same options exists
    const existing = cart.items.find(
      (i: any) =>
        i.slug === slug &&
        JSON.stringify(i.options || []) === JSON.stringify(options || [])
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.items.push({ slug, title, price, options, quantity: 1 });
    }

    await cart.save();
    return NextResponse.json({ items: cart.items });
  } catch (err: any) {
    console.error("Cart POST error:", err);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}

// PUT update quantity
export async function PUT(req: Request) {
  await connectDB();
  const sessionId = await getSessionId();
  const { slug, quantity } = await req.json();

  let cart = await Cart.findOne({ sessionId });
  if (!cart) {
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });
  }

  const item = cart.items.find((i: any) => i.slug === slug);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }

  await cart.save();
  return NextResponse.json({ items: cart.items });
}

// ✅ DELETE remove item
export async function DELETE(req: Request) {
  await connectDB();
  const sessionId = await getSessionId();
  const { slug, options } = await req.json();

  let cart = await Cart.findOne({ sessionId });
  if (!cart) {
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });
  }

  cart.items = cart.items.filter((i: any) => {
    if (i.slug !== slug) return true;

    if (options) {
      return JSON.stringify(i.options || []) !== JSON.stringify(options);
    }

    return false;
  });

  await cart.save();
  return NextResponse.json({ items: cart.items });
}
