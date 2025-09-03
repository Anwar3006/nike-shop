import { NextRequest, NextResponse } from "next/server";
import { redisClient } from "@/lib/cache/redis-client";
import { authClient } from "@/lib/auth-client";

export async function PATCH(request: NextRequest) {
  try {
    const session = await authClient.getSession();

    if (!session.data?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { shoeId, size, color, quantity } = await request.json();

    const cartInstance = await redisClient();
    const cartKey = `cart:${session.data?.user.id}`;
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
    const parsedItem = JSON.parse(existingItem as string);
    parsedItem.quantity = quantity;

    const pipeline = cartInstance.pipeline();
    pipeline.hset(cartKey, { [fieldKey]: JSON.stringify(parsedItem) });
    pipeline.expire(cartKey, 30 * 24 * 60 * 60); // Refresh TTL
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
