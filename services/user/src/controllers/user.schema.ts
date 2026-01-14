import zod from "zod";

export const skillPayload = zod.object({
    skill: zod.string()
}).required();