import axios from "axios";
import { NextApiRequest } from "next";

export const splitFullName = (fullName: string) => {
  const nameParts = fullName.trim().split(/\s+/);

  if (nameParts.length === 0) return ["", ""];
  if (nameParts.length === 1) return [nameParts[0], ""];

  // First part is firstName, everything else is lastName
  const firstName = nameParts.slice(0, 2).join(" ");
  const lastName = nameParts[2];

  return [firstName, lastName];
};

// Helper to get user from request in API routes
export async function getUserFromRequest(request: NextApiRequest) {
  try {
    // Better Auth typically stores session in cookies
    // Adjust the cookie name based on your Better Auth configuration
    const sessionToken = request.cookies["nike-shop.session_token"];

    if (!sessionToken) {
      return null;
    }

    // Make a request to your auth server to verify the session
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/get-session`,
      {
        headers: {
          cookie: request.headers.cookie || "",
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
