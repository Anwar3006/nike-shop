# Backend Implementation Checklist (V2 - with Source Code)

This checklist provides a hierarchical guide to recreating the backend codebase, function by function, including the full source code for implementation.

---

## **Folder: `src/errors`**

### **File: `errorHandler.ts`**
#### **Function: `NotFound()`**
- **Input:** `req` (Request), `res` (Response), `next` (NextFunction)
- **Purpose:** An Express middleware to catch requests for routes that don't exist and create a 404 `AppError`.
- **Output:** `void` (calls `next(error)`)
- **External Libraries:** `express`
- **Source Code:**
  ```typescript
  export const NotFound = (req: Request, _: Response, next: NextFunction) => {
    const error = new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      404
    );
    next(error);
  };
  ```

#### **Function: `globalErrorHandler()`**
- **Input:** `err` (AppError), `req` (Request), `res` (Response), `next` (NextFunction)
- **Purpose:** The main Express error handling middleware. Sends detailed errors in development and generic, safe errors in production.
- **Output:** `void` (calls `res.status().json()`)
- **External Libraries:** `express`
- **Source Code:**
  ```typescript
  export const globalErrorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (NODE_ENV === "development") {
      sendErrorDev(err, res);
    } else {
      sendErrorProd(err, res);
    }
  };
  ```

#### **Function: `catchAsync()`**
- **Input:** `fn` (an async route handler function)
- **Purpose:** A higher-order function that wraps async route handlers to automatically catch errors and pass them to `next()`.
- **Output:** An Express middleware function.
- **External Libraries:** `express`
- **Source Code:**
  ```typescript
  export const catchAsync = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        fn(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  };
  ```

---
## **Folder: `src/middlewares`**

### **File: `validate.middleware.ts`**
#### **Function: `validate()`**
- **Input:** `schema` (ZodObject)
- **Purpose:** A higher-order function that returns an Express middleware for validating request data.
- **Output:** An Express middleware function.
- **External Libraries:** `express`, `zod`
- **Source Code:**
  ```typescript
  const validate =
    (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        next();
      } catch (error: any) {
        return res.status(400).json({
          error: "Validation Error",
          message: JSON.parse(error.message),
        });
      }
    };
  export default validate;
  ```

### **File: `verfiyAuth.middleware.ts`**
#### **Function: `optionalAuth()`**
- **Input:** `req`, `res`, `next`
- **Purpose:** To check for a user session and attach `req.user` if it exists, but to allow the request to proceed regardless.
- **Output:** `void` (calls `next()`)
- **External Libraries:** `better-auth`, `express`
- **Source Code:**
  ```typescript
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
      }
      next();
    } catch (error) {
      next();
    }
  };
  ```

#### **Function: `verifyAuth()`**
- **Input:** `req`, `res`, `next`
- **Purpose:** To require a valid user session, ending the request with 401 if not found.
- **Output:** `void` (calls `next()` or `res.status().json()`)
- **External Libraries:** `better-auth`, `express`
- **Source Code:**
  ```typescript
  export const verifyAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const headers = fromNodeHeaders(req.headers);
      const session = await auth.api.getSession({
        headers,
        query: { disableCookieCache: true },
      });

      if (!session?.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - No valid session found",
        });
      }
      req.user = session.user;
      req.session = session.session;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Session validation failed",
      });
    }
  };
  ```
---
*(This pattern continues for all other functions in `utils`, `controllers`, `services`, and `repositories`)*
