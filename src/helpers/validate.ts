import { ZodType } from "zod";

export default function validate<T>(schema: ZodType, payload: T): T {
  return schema.parse(payload);
}
