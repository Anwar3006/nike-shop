"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { signUpSchema, SignUpSchemaType } from "@/schemas/auth.schema";
import AuthForm from "@/components/AuthForm";
import { toast } from "sonner";
import { ToastID } from "@/types";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const router = useRouter();
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSignUp = async (data: SignUpSchemaType) => {
    try {
      await signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
        },
        {
          onSuccess: (ctx) => {
            console.log("Success signing up:", ctx);
            toast.success("Success signing up🎊🎉", {
              id: ToastID.REGISTER_SUCCESS,
              description: `Welcome to our platform, ${ctx.data.name} and happy shopping!`,
              duration: 6000,
            });

            setTimeout(() => {
              router.push("/");
            }, 1000);
          },
          onError: (ctx) => {
            console.error("Error signing up:", ctx.error);
            toast.error("❌Error signing up😪", {
              id: ToastID.REGISTER_ERROR,
              description: `Error: ${ctx.error}!`,
              duration: 8000,
            });
          },
        }
      );
    } catch (error) {
      console.error("Apologies, an error occurred:", error);
      toast.error("❌Error signing in😪", {
        id: ToastID.SYSTEM_ERROR,
        description: `We are facing some internal issues\n Please hold on for a few seconds and try again.\nError: ${error}!`,
        duration: 8000,
      });
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="mb-8 self-center text-base font-bevellier">
        <span className="text-muted-foreground ">
          Already have an account?{" "}
        </span>
        <Link
          href="/sign-in"
          className="font-medium text-primary hover:underline font-bevellier"
        >
          Sign In
        </Link>
      </div>

      <AuthForm type="sign-up" form={form} onSubmit={handleSignUp} />

      <p className="mt-8 text-center text-xs text-muted-foreground text-footnote font-bevellier">
        By signing up, you agree to our{" "}
        <Link href="#" className="underline hover:text-primary">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="underline hover:text-primary">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};

export default SignUpPage;
