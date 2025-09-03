import { NextRequest, NextResponse } from "next/server";
import { redisClient } from "@/lib/cache/redis-client";
import { authClient } from "@/lib/auth-client";
import { getUserFromRequest } from "../route";
import { CartItem } from "@/types/cart";

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { shoeId, size, color, quantity } = await request.json();

    const cartInstance = await redisClient();
    const cartKey = `cart:${user.id}`;
    const fieldKey = `${shoeId}:${size}:${color || "default"}`;

    // Get existing item
    const existingItem = await cartInstance.hget(cartKey, fieldKey);
    if (!existingItem) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    // Update quantity
    const parsedItem = {
      ...existingItem,
      quantity: (existingItem as CartItem).quantity + quantity,
    } as CartItem;

    const pipeline = cartInstance.pipeline();
    pipeline.hset(cartKey, { [fieldKey]: JSON.stringify(parsedItem) });
    pipeline.expire(cartKey, 7 * 24 * 60 * 60); // Refresh TTL
    await pipeline.exec();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
