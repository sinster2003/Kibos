import { prettifyError } from "zod";
import catchAsync from "../utils/catchAsync.js";
import CustomError from "../utils/customError.js";
import { ControllerType } from "../utils/types.js";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";
import { createUser, findUserByEmail, isExistingUserByEmail } from "../db/queries/users.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { NODE_ENV } from "../config/index.js";
import generateJwt from "../utils/generateJWT.js";
import { randomBytes, createHash } from "crypto";
import { storeRefreshToken } from "../db/queries/tokens.js";

const registerUser: ControllerType = async (req, res) => {
    const userDetails = req.body;

    const { success, error, data } = registerUserSchema.safeParse(userDetails);

    if(!success) {
        throw new CustomError(400, prettifyError(error));
    }

    const { email, password } = data;

    const isUserExisting = await isExistingUserByEmail(email);

    if(isUserExisting) {
        throw new CustomError(409, "User with this email already exists. Please log in.");
    }

    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const registeredUser = await createUser({ ...data, userId: uuidv4(), password: hashedPassword });

    if(!registeredUser) {
        throw new CustomError(500, "User registration failed.");
    }

    // generating token
    const token = generateJwt({ sub: registeredUser.user_id, role: registeredUser.role });

    // generating refresh token and store in DB
    const refreshToken = randomBytes(64).toString("hex");
    
    const tokenHash = createHash("sha256").update(refreshToken).digest("hex");

    const createdRefreshToken = await storeRefreshToken({
        id: uuidv4(),
        userId: registeredUser.user_id,
        tokenHash,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    if(!createdRefreshToken) {
        throw new CustomError(500, "Refresh token creation failed.");
    }

    res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: NODE_ENV === "production",
        maxAge: 15 * 60 * 1000
    });

    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth", // the refresh token must be sent only to auth service
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        message: "Your account has been created successfully.",
    });
}

const loginUser: ControllerType = async (req, res) => {
    const loginDetails = req.body;

    const { success, error, data } = loginUserSchema.safeParse(loginDetails);

    if(!success) {
        throw new CustomError(400, prettifyError(error));
    }

    const { email, password } = data;

    const isUserExisting = await findUserByEmail(email);

    if(!isUserExisting) {
        throw new CustomError(400, "Invalid credentials.");
    }

    const isPasswordMatching = await bcrypt.compare(password, isUserExisting.password);

    if(!isPasswordMatching) {
        throw new CustomError(400, "Invalid credentials.");
    }

    // generate the access token
    const accessToken = generateJwt({ sub: isUserExisting.user_id, role: isUserExisting.role });

    // generate refresh token and store in database
    const refreshToken = randomBytes(64).toString("hex");

    const tokenHash = createHash("sha256").update(refreshToken).digest("hex");

    const createdRefreshToken = await storeRefreshToken({
        id: uuidv4(),
        userId: isUserExisting.user_id,
        tokenHash,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    if(!createdRefreshToken) {
        throw new CustomError(500, "Refresh token creation failed.");
    }

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: NODE_ENV === "production",
        maxAge: 15 * 60 * 1000
    });

    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth", // the refresh token must be sent only to auth service
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        message: "You have logged in successfully."
    })
}

export default {
    registerUser: catchAsync(registerUser),
    loginUser: catchAsync(loginUser)
}