// zod schemas
import * as zod from "zod";

export const registerUserSchema = zod.object({
    name: zod.string().min(2, "Name must be at least 2 characters long").max(50),
    email: zod.email(),
    password: zod.string().min(6, "Password must be at least 6 characters long"),
    phoneNo: zod.string().min(10, "Phone number must be at least 10 characters long"),
    role: zod.enum(["jobseeker", "recruiter"])
})
.required();
