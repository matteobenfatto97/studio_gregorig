"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminFormValidation } from "@/lib/validation"; // Ensure this path and export are correct
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import SubmitButton from "../SubmitButton";
import { loginAdmin } from "@/lib/actions/admin.actions"; // Correct import without file extension

export const AdminForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof AdminFormValidation>>({
    resolver: zodResolver(AdminFormValidation),
    defaultValues: {
      email: "",
      password: "",
      adminCode: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof AdminFormValidation>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { email, password, adminCode } = values;

      // Call your API or Appwrite function to check credentials
      const response = await loginAdmin(email, password, adminCode);

      if (response) {
        router.push("/admin"); // Redirect to admin dashboard or any other page
      } else {
        setError("Invalid login credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Admin Login
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="admin@example.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
          type="email"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="password"
          label="Password"
          placeholder="Your Password"
          type="password"
          iconSrc="/assets/icons/password.svg"
          iconAlt="password"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="adminCode"
          label="Admin Code"
          placeholder="Admin Code"
        />

        <SubmitButton isLoading={isLoading}>Login</SubmitButton>
      </form>
    </Form>
  );
};
