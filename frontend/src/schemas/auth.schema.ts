import z, { email, output } from "zod";

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
