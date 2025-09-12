import { array, number, object, string } from "zod";
import type { output } from "zod";

export const createShoeSchema = object({
  body: object({
    // Basic shoe information
    name: string().min(1, "Name is required"),
    description: string().optional(),
    categoryId: number().int().positive("Category is required"), // "1 = Women's Shoes", "2 = Men's Shoes", etc.
    styleNumber: string().optional(), // "HM9451-600"
    basePrice: number().int().positive("Base price must be positive"),

    // Color variants - each shoe needs at least one variant
    colorVariants: array(
      object({
        name: string().min(1, "Variant name is required"), // "Dark Team Red/Platinum Tint/Pure Platinum/White"
        dominantColor: string().min(1, "Dominant color is required"), // "Red", "White", "Black"

        // Images for this color variant
        images: array(
          object({
            imageUrl: string().url("Must be a valid URL"),
            altText: string().optional(),
          })
        ).min(1, "Each variant needs at least one image"),

        // Size availability and pricing for this variant
        sizeAvailability: array(
          object({
            sizeId: number().int().positive("Size ID is required"),
            price: number().int().positive("Price must be positive"), // Can override base price
            quantity: number()
              .int()
              .min(0, "Quantity cannot be negative")
              .default(0),
          })
        ).min(1, "Each variant needs at least one size"),
      })
    ).min(1, "Product needs at least one color variant"),
  }),
});
export type CreateShoeSchemaType = output<typeof createShoeSchema>;

// Update Schema for updates (all fields optional)
export const updateShoeSchema = object({
  body: object({
    name: string().min(1).optional(),
    description: string().optional(),
    categoryId: number().int().positive().optional(),
    styleNumber: string().min(4).optional(),
    basePrice: number().int().positive().optional(),
    colorVariants: array(
      object({
        id: string().optional(), // If provided, update existing; if not, create new
        name: string().min(1).optional(),
        dominantColor: string().min(1).optional(),
        images: array(
          object({
            imageUrl: string().url(),
            altText: string().optional(),
          })
        ).optional(),
        sizeAvailability: array(
          object({
            sizeId: number().int().positive(),
            price: number().int().positive(),
            quantity: number().int().min(0).default(0),
          })
        ).optional(),
      })
    ).optional(),
  }).refine(
    (data) => {
      return Object.values(data).some((value) => value !== undefined);
    },
    {
      message: "At least one field must be provided for update",
    }
  ),
});

export type UpdateShoeSchemaType = output<typeof updateShoeSchema>;

export const getShoesSchema = object({
  query: object({
    limit: string().nonoptional(),
    offset: string().nonoptional(),

    sort: string().optional(),
    color: string().optional(),
    gender: string().optional(),
    size: string().optional(),
    minPrice: string().optional(),
    maxPrice: string().optional(),
  }),
});
export type GetShoesSchemaType = output<typeof getShoesSchema>;
