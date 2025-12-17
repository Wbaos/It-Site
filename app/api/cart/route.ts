import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Cart as CartModel } from "../../models/Cart";
import { getSessionId } from "@/lib/sessionId";
import { randomUUID } from "crypto";

interface CartItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  basePrice: number;
  price: number;
  options?: Array<{ name: string; price: number }>;
  quantity?: number;
}

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const querySessionId = searchParams.get("sessionId");
  const sessionId = querySessionId || (await getSessionId());

  if (!sessionId) {
    return NextResponse.json({ error: "No sessionId provided" }, { status: 400 });
  }

  let cart = await CartModel.findOne({ sessionId });
  if (!cart) {
    cart = await CartModel.create({ sessionId, items: [] });
  }

  return NextResponse.json({ items: cart.items });
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const sessionId = await getSessionId();

    const { slug, title, description, basePrice, options } = await req.json();

    const addonsTotal =
      options?.reduce(
        (sum: number, opt: { price?: number }) => sum + (opt.price || 0),
        0
      ) || 0;

    const totalPrice = (basePrice || 0) + addonsTotal;

    let cart = await CartModel.findOne({ sessionId });
    if (!cart) cart = await CartModel.create({ sessionId, items: [] });

    const existing = cart.items.find((i: CartItem) => i.slug === slug);

    if (!existing) {
      cart.items.push({
        id: randomUUID(),
        slug,
        title,
        description,
        basePrice,
        price: totalPrice,
        options,
        quantity: 1,
      });
    }

    await cart.save();
    return NextResponse.json({ items: cart.items });
  } catch (err) {
    console.error("POST /api/cart error:", err);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const sessionId = await getSessionId();
    const body = await req.json();

    const { id, quantity, contact, address, schedule, ...updates } = body;

    const cart = await CartModel.findOne({ sessionId });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (id) {
      const itemIndex = cart.items.findIndex((i: CartItem) => i.id === id);
      if (itemIndex !== -1) {
        const current = cart.items[itemIndex];

        cart.items[itemIndex] = {
          ...current,
          ...updates,      
          id: current.id,
          slug: current.slug,
          title: current.title,
          description: updates.description ?? current.description, 
          basePrice: updates.basePrice ?? current.basePrice,
          price: updates.price ?? current.price,
          options: updates.options ?? current.options,
          quantity: Math.max(1, quantity ?? current.quantity),
        };
      }
    }

    if (contact) cart.contact = contact;
    if (address) cart.address = address;
    if (schedule) cart.schedule = schedule;

    await cart.save();

    return NextResponse.json({
      items: cart.items,
      contact: cart.contact,
      address: cart.address,
      schedule: cart.schedule,
    });
  } catch (err) {
    console.error("PUT /api/cart error:", err);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await connectDB();
  const sessionId = await getSessionId();

  const cart = await CartModel.findOne({ sessionId });
  if (!cart)
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const id = body?.id;

  if (!id) {
    cart.items = [];
  } else {
    cart.items = cart.items.filter((i: CartItem) => i.id !== id);
  }

  await cart.save();
  return NextResponse.json({ items: cart.items });
}
