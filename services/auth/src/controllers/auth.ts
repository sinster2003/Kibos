import { prettifyError } from "zod";
import catchAsync from "../utils/catchAsync.js";
import CustomError from "../utils/customError.js";
import { ControllerType } from "../utils/types.js";
import { registerUserSchema } from "./auth.schema.js";
import { createUser, findExistingUserByEmail } from "../db/queries/users.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const registerUser: ControllerType = async (req, res) => {
    const userDetails = req.body;

    const { success, error, data } = registerUserSchema.safeParse(userDetails);

    if(!success) {
        throw new CustomError(400, prettifyError(error));
    }

    const { email, password } = data;

    const isUserExisting = await findExistingUserByEmail(email);

    if(isUserExisting) {
        throw new CustomError(409, "User with this email already exists. Please log in.");
    }

    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const registeredUser = await createUser({ ...data, userId: uuidv4(), password: hashedPassword });

    if(!registeredUser) {
        throw new CustomError(500, "User registration failed.");
    }

    res.status(200).json({
        message: `${registeredUser?.name} registered successfully`,
    });
}

export default {
    registerUser: catchAsync(registerUser)
}