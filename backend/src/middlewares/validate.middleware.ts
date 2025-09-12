import type { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

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
