"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Suspense } from "react";

import { signInSchema, SignInSchemaType } from "@/schemas/auth.schema";
import AuthForm from "@/components/AuthForm";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { ToastID } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { extractRedirectUrl } from "@/utils/auth-redirect";

// Separate component that uses useSearchParams
// we did this differently from the sign-up page because we needed to use the searchParams to get the redirect url
// and the useSearchParams hook will hydration mismatches between server and client rendering, so Next.js requires
// you to explicitly handle the loading state with Suspense.
const SignInContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirectUrl, setRedirectUrl] = useState("/");

  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const redirect: string = extractRedirectUrl(searchParams);
    setRedirectUrl(redirect);
  }, [searchParams]);

  const handleSignIn = async (data: SignInSchemaType) => {
    try {
      await signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: (ctx) => {
            console.log("Success signing in:", ctx);
            toast.success("Success signing in🎊🎉", {
              id: ToastID.LOGIN_SUCCESS,
              description: `Welcome back, ${ctx.data.user.name}!`,
              duration: 4000,
            });

            setTimeout(() => {
              router.push(redirectUrl);
            }, 1000);
          },
          onError: (ctx) => {
            console.error("Error signing in:", ctx.error);
            toast.error("❌Error signing in😪", {
              id: ToastID.LOGIN_ERROR,
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

  const signUpHref =
    redirectUrl !== "/"
      ? `/sign-up?redirect=${encodeURIComponent(redirectUrl)}`
      : "/sign-up";

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="mb-8 self-center text-base font-bevellier">
        <span className="text-muted-foreground">
          Don&apos;t have an account?{" "}
        </span>
        <Link
          href={signUpHref}
          className="font-medium text-primary hover:underline"
        >
          Sign Up
        </Link>
      </div>

      <AuthForm type="sign-in" form={form} onSubmit={handleSignIn} />
    </div>
  );
};

// Loading fallback component
const SignInLoading = () => (
  <div className="flex w-full flex-col items-center justify-center">
    <div className="mb-8 self-center text-base font-bevellier">
      <span className="text-muted-foreground">
        Don&apos;t have an account?{" "}
      </span>
      <Link
        href="/sign-up"
        className="font-medium text-primary hover:underline"
      >
        Sign Up
      </Link>
    </div>

    <div className="w-full max-w-md">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

// Main component with Suspense boundary
const SignInPage = () => {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInContent />
    </Suspense>
  );
};

export default SignInPage;
