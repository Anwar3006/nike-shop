"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import SocialProviders from "./SocialProviders";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const AuthForm = ({
  type,
  form,
  onSubmit,
}: {
  type: "sign-in" | "sign-up";
  form: UseFormReturn<any, any, any>;
  onSubmit: (data: any) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      <h2 className="mb-2 text-3xl font-bold text-foreground text-center text-heading-3 tracking-wide font-bevellier">
        {type === "sign-in" ? "Sign In" : "Join Nike Today!"}
      </h2>
      <p className="mb-8 text-muted-foreground text-center text-body font-bevellier">
        {type === "sign-in"
          ? "Welcome back to your account"
          : "Create your account to start your fitness journey"}
      </p>

      <SocialProviders />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          {type === "sign-up" && (
            <div className="mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-lead text-lg font-bevellier">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        {...field}
                        className="text-foreground font-bevellier"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="mb-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-lead text-lg font-bevellier">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="sweetpine@gmail.com"
                      {...field}
                      className="text-foreground font-bevellier"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="relative mb-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-lead text-lg font-bevellier">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="*********"
                        {...field}
                        className={cn(
                          "text-foreground font-bevellier pr-10",
                          !showPassword && "tracking-widest font-black text-lg"
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full text-white! rounded-full hover:cursor-pointer hover:bg-gray-900 text-lead! font-bevellier"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Loading..."
              : type === "sign-in"
              ? "Sign In"
              : "Sign Up"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AuthForm;
