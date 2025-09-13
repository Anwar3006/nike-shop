import z, { boolean, email, object, string } from "zod";

import type { output } from "zod";
export const updateUserInfoSchema = object({
  body: object({
    firstName: string().min(1, "Firstname is required"),
    lastName: string().min(1, "Lastname is required"),
    email: email("Invalid email").nonempty("Email is required"),
    dob: string().optional(),
  }),
});
export type UpdateUserInfoSchemaType = output<typeof updateUserInfoSchema>;

export const addressSchema = object({
  body: object({
    streetAddress: string().min(1, "Street address is required"),
    city: string().min(1, "City is required"),
    state: string()
      .length(2, "State must be 2 characters (e.g., CA)")
      .regex(/^[A-Z]{2}$/, "State must be uppercase initials (e.g., CA)"),
    zipcode: string().regex(
      /^\d{5}(-\d{4})?$/,
      "Invalid ZIP code format (e.g., 12345 or 12345-6789)"
    ),
    phone: string().regex(/^\+?[\d\s\-\(\)]{10,}$/, "Invalid telephone number"),
    type: z.enum(["Home", "Work", "Other"]).default("Home").nonoptional(),
    isDefault: boolean().default(false).nonoptional(),
  }),
});

export type AddressFormData = output<typeof addressSchema>;
