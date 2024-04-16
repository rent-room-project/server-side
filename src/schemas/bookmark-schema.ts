import { z } from "zod";

export const bookmarkSchema = z.object({
  UserId: z
    .string({
      required_error: "User ID is required",
      invalid_type_error: "User ID must be a string",
    })
    .uuid("User ID must be a valid uuid"),
  LodgingId: z
    .string({
      required_error: "Lodging ID is required",
      invalid_type_error: "Lodging ID must be a string",
    })
    .uuid("Lodging ID must be a valid uuid"),
});

export type CreateBookmarkDTO = z.infer<typeof bookmarkSchema>;
