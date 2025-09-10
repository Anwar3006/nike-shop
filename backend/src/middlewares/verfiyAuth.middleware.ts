import { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../utils/auth.js";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        // Add other user properties you need
      };
      session?: {
        id: string;
        userId: string;
        expiresAt: Date;
        // Add other session properties you need
      };
    }
  }
}

// optionalAuth: Allows both authenticated and anonymous users
//Search results use optionalAuth (allows anonymous search but gets user if authenticated)

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const headers = fromNodeHeaders(req.headers);
    const session = await auth.api.getSession({ headers });

    if (session?.user) {
      req.user = session.user;
      req.session = session.session;
      console.log("Optional auth - user authenticated:", req.user.id);
    }

    // Continue regardless of authentication status
    next();
  } catch (error) {
    console.error("Optional auth error:", error);
    // Continue without authentication
    next();
  }
};

//verifyAuth: Requires authentication, returns 401 if not authenticated
//Search history uses verifyAuth (requires authentication)
export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Convert Express headers to better-auth compatible format
    const headers = fromNodeHeaders(req.headers);

    // Use better-auth's built-in session validation
    const session = await auth.api.getSession({
      headers,
      query: { disableCookieCache: true },
    });

    // console.log("Headers: ", headers);
    console.log("Session: ", session);
    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No valid session found",
      });
    }

    // Attach user and session data to request object
    req.user = session.user;
    req.session = session.session;

    console.log("Authenticated user:", req.user.id);
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Session validation failed",
    });
  }
};
