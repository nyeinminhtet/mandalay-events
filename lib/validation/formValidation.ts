import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters.")
    .max(400, "Description must be less than 400 characters."),
  location: z
    .string()
    .min(3, "Location must be 3 characters")
    .max(400, "Location must be less than 400 characters"),
  imageUrl: z.string(),
  startDateTime: z.date(),
  endDateTiem: z.date(),
  categoryId: z.string(),
  pirce: z.string(),
  isFree: z.boolean(),
  url: z.string().url(),
});

export type FormValidator = z.infer<typeof formSchema>;
