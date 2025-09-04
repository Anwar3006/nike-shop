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

type MyDetailsTabProps = {
  customerDetails_: Omit<Customer, "id" | "addresses">;
};

const MyDetailsTab = ({ customerDetails_ }: MyDetailsTabProps) => {
  const userDetails = customerDetails_ || {
    firstName: "Ronald",
    lastName: "Williams",
    email: "ronald@mail.com",
    phone: "+1 234 567 890",
    dob: "1990-01-01",
  };

  const form = useForm<UserProfileSchemaType>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      firstName: userDetails.firstName || "",
      lastName: userDetails.lastName || "",
      email: userDetails.email || "",
      dob: userDetails.dob || "",
    },
  });

  const handleForm = (data: UserProfileSchemaType) => {
    console.log(data);
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
                        // disabled={isLoading}
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
                        // disabled={isLoading}
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
                      // disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-lead text-lg font-bevellier">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+1 234 567 890"
                      {...field}
                      className="text-foreground font-bevellier"
                      // disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

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
                      // disabled={isLoading}
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
                disabled={!isDirty}
                className="font-bevellier"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={!isDirty}
                className="font-bevellier"
              >
                {/* {isLoading ? "Saving..." : "Save Changes"} */}
                Save
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MyDetailsTab;
