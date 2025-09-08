// src/app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { redisClient } from "@/lib/cache/redis-client";
import { cookies } from "next/headers";
import axios from "axios";

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

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartInstance = await redisClient();
    const cartData = await cartInstance.hgetall(`cart:${user.id}`);

    if (!cartData || Object.keys(cartData).length === 0) {
      return NextResponse.json([]);
    }

    const cartItems = Object.entries(cartData).map(([fieldKey, value]) => ({
      itemKey: fieldKey,
      value,
    }));

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { shoeId, name, image, price, quantity, size, color } =
      await request.json();

    const cartInstance = await redisClient();
    const cartKey = `cart:${user.id}`;
    const fieldKey = `${shoeId}:${size}:${color || "default"}`;

    // Check if item already exists
    const existingItem = await cartInstance.hget(cartKey, fieldKey);
    if (existingItem) {
      return NextResponse.json(
        { success: false, message: "ITEM_EXISTS" },
        { status: 409 }
      );
    }

    // Add new item
    const cartItem = {
      shoeId,
      name,
      image,
      price,
      quantity,
      size,
      color: color || null,
      addedAt: Date.now(),
    };

    const pipeline = cartInstance.pipeline();
    pipeline.hset(cartKey, { [fieldKey]: JSON.stringify(cartItem) });
    pipeline.expire(cartKey, 7 * 24 * 60 * 60); // 7 days TTL
    await pipeline.exec();

    return NextResponse.json({ success: true, message: "COMPLETED" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { shoeId, size, color } = await request.json();

    const cartInstance = await redisClient();
    const cartKey = `cart:${user.id}`;
    const fieldKey = `${shoeId}:${size}:${color || "default"}`;

    await cartInstance.hdel(cartKey, fieldKey);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
