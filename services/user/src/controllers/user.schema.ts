import zod from "zod";

export const skillSchema = zod.object({
    skill: zod.string()
}).required();

export const profileSchema = zod.object({
    name: zod.string().min(1, "Name cannot be empty.").optional(),
    phoneNo: zod
        .string()
        .min(10, "Invalid phone number. Length of phone number must be at least 10.")
        .max(20, "Invalid phone number. Length of phone number exceeds 20.")
        .optional(),
    bio: zod.string().max(500, "Bio must at less than 500 characters.").optional()
});