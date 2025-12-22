import { prettifyError } from "zod";
import catchAsync from "../utils/catchAsync.js";
import CustomError from "../utils/customError.js";
import { ControllerType } from "../utils/types.js";
import { registerUserSchema } from "./auth.schema.js";
import { createUser, existingUser } from "../db/queries/users.js";
import bcrypt from "bcrypt";

const registerUser: ControllerType = async (req, res) => {
    const userDetails = req.body;

    const { success, error, data } = registerUserSchema.safeParse(userDetails);

    if(!success) {
        throw new CustomError(400, prettifyError(error));
    }

    const { email, password, role } = data;

    const isUserExisting = await existingUser(email);

    if(isUserExisting) {
        throw new CustomError(409, "User with this email already exists. Please log in");
    }

    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let registeredUser = null;

    if(role === "recruiter") {
        registeredUser = await createUser({ ...data, password: hashedPassword });

        if(!registeredUser) {
            throw new CustomError(500, "Registration failed due to server issue");
        }
    }
    else if(role === "jobseeker") {
        registeredUser = await createUser({ ...data, password: hashedPassword });

        if(!registeredUser) {
            throw new CustomError(500, "Registration failed due to server issue");
        }
    }

    res.status(200).json({
        message: `${registeredUser?.name} registered successfully`,
    });
}

export default {
    registerUser: catchAsync(registerUser)
}