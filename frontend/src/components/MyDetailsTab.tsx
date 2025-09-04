"use client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Customer } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userProfileSchema,
  UserProfileSchemaType,
} from "@/schemas/auth.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useUpdateInfo } from "@/hooks/api/use-userInfo";
import { useEffect } from "react";

type MyDetailsTabProps = {
  customerDetails: Omit<Customer, "id" | "addresses">;
};

const MyDetailsTab = ({ customerDetails }: MyDetailsTabProps) => {
  const { mutate: updateInfo, isPending: isLoading } = useUpdateInfo();

  const form = useForm<UserProfileSchemaType>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      firstName: customerDetails?.firstName || "",
      lastName: customerDetails?.lastName || "",
      email: customerDetails?.email || "",
      dob: customerDetails?.dob || "",
    },
  });

  useEffect(() => {
    if (customerDetails) {
      form.reset({
        firstName: customerDetails.firstName || "",
        lastName: customerDetails.lastName || "",
        email: customerDetails.email || "",
        dob: customerDetails.dob || "",
      });
    }
  }, [customerDetails, form]);

  const handleForm = (data: UserProfileSchemaType) => {
    updateInfo(data);
  };

  const isDirty = form.formState.isDirty;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">My Details</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleForm)} className="w-full">
          <div className="space-y-6 max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-lead text-lg font-bevellier">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Jason"
                        {...field}
                        className="text-foreground font-bevellier"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-lead text-lg font-bevellier">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Tester"
                        {...field}
                        className="text-foreground font-bevellier"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-lead text-lg font-bevellier">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="JayT@gmail.com"
                      {...field}
                      className="text-foreground font-bevellier"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-lead text-lg font-bevellier">
                    Date of Birth
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="1990-01-01"
                      {...field}
                      className="text-foreground font-bevellier"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={!isDirty || isLoading}
                className="font-bevellier"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={!isDirty || isLoading}
                className="font-bevellier"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MyDetailsTab;
