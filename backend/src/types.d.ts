type GetShoesOptions = {
  limit: string;
  offset: string;
  sortBy?: string;
  categoryId?: number;
  minPrice?: string;
  maxPrice?: string;
};

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
