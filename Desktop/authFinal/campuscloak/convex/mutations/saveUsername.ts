import { mutation } from "../_generated/server";

export const saveUsername = mutation(async ({ db }, { clerkId, username }) => {
  if (!username) {
    throw new Error("Username is required.");
  }

  // Check if the username already exists
  const existingUser = await db
    .query("users")
    .withIndex("by_username", (q) => q.eq("username", username))
    .first();

  if (existingUser) {
    throw new Error("Username already taken.");
  }

  // Update or insert the user in the `users` table
  await db
    .table("users")
    .insertOrReplace({
      _id: clerkId, // Use Clerk user ID as the primary identifier
      username,
    });

  return { success: true };
});
