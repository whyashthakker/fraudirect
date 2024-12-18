import * as z from "zod"

export const fraudReportSchema = z.object({
  type: z.enum(["email", "phone", "person"]),
  identifier: z.string().min(1),
  description: z.string().min(10),
  city: z.string().optional(),
  street: z.string().optional(),
  evidence: z.string().optional(),
})