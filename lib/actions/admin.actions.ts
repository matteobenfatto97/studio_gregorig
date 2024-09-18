"use server";
import { ID, Query } from "node-appwrite";

import {
  DATABASE_ID,
  ADMIN_COLLECTION_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";
// lib/actions/admin.actions.ts

// Define the CheckAdminParams type
interface CheckAdminParams {
  email: string;
  password: string;
  adminCode: string;
}

// CHECK ADMIN CREDENTIALS
export const checkAdminCredentials = async ({
  email,
  password,
  adminCode,
}: CheckAdminParams) => {
  try {
    // Query the admin collection to find a matching document
    const response = await databases.listDocuments(
      DATABASE_ID!,
      ADMIN_COLLECTION_ID!,
      [
        Query.equal("email", [email]),
        Query.equal("password", [password]),
        Query.equal("adminCode", [adminCode]),
      ]
    );

    if (response.total === 1) {
      // Admin found
      return parseStringify(response.documents[0]);
    } else {
      // No matching admin found
      return null;
    }
  } catch (error) {
    console.error("An error occurred while checking admin credentials:", error);
    throw new Error("An error occurred while verifying admin credentials.");
  }
};
export const loginAdmin = async (
  email: string,
  password: string,
  adminCode: string
) => {
  try {
    const admin = await checkAdminCredentials({ email, password, adminCode });
    return admin;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Failed to login.");
  }
};
