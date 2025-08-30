import z, { email, output, string } from "zod";

export const signUpSchema = z.object({
  name: z.string("Name is required").nonempty("Name is required"),
  email: email("Invalid email").nonempty("Email is required"),
  password: z.string().min(8),
});
export type SignUpSchemaType = output<typeof signUpSchema>;

export const signInSchema = z.object({
  email: email("Invalid email").nonempty("Email is required"),
  password: z.string().min(8),
});
export type SignInSchemaType = output<typeof signInSchema>;

export const userProfileSchema = z.object({
  firstName: string("First name is required"),
  lastName: string("Last name is required"),
  email: email("Invalid email").nonempty("Email is required"),
  phone: string("Phone number is required"),
  dob: string("Date of birth is required"),
});
export type UserProfileSchemaType = output<typeof userProfileSchema>;

export const addressSchema = z.object({
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z
    .string()
    .length(2, "State must be 2 characters (e.g., CA)")
    .regex(/^[A-Z]{2}$/, "State must be uppercase initials (e.g., CA)"),
  zipCode: z
    .string()
    .regex(
      /^\d{5}(-\d{4})?$/,
      "Invalid ZIP code format (e.g., 12345 or 12345-6789)"
    ),
  telephone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]{10,}$/, "Invalid telephone number"),
});

export type AddressFormData = output<typeof addressSchema>;
