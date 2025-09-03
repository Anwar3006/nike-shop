import z, { output } from "zod";

export const addToCartSchema = z.object({
  quantity: z
    .number()
    .min(1, "Quantity must be at least 1")
    .max(10, "Maximum quantity is 10"),
  size: z.string().min(1, "Please select a size"),
  color: z.string().min(1, "Please select a color"),
  name: z.string(),
  image: z.string(),
  price: z.number(),
});

export type AddToCartFormData = output<typeof addToCartSchema>;
