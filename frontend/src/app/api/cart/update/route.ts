import { NextRequest, NextResponse } from "next/server";
import { redisClient } from "@/lib/cache/redis-client";

import { CartItem } from "@/types/cart";
import axios from "axios";
import { cookies } from "next/headers";

// Helper to get user from request in API routes
async function getUserFromRequest(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Better Auth typically stores session in cookies
    // Adjust the cookie name based on your Better Auth configuration
    const sessionToken = cookieStore.get("nike-shop.session_token")?.value;

    if (!sessionToken) {
      return null;
    }

    // Make a request to your auth server to verify the session
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/get-session`,
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (response.status !== 200) {
      return null;
    }

    const session = await response.data;
    return session.user;
  } catch (error) {
    console.error("Error verifying session:", error);
    return null;
  }
}

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
