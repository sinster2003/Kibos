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
import { getRefreshToken, revokeRefreshToken, rotateRefreshToken, storeRefreshToken } from "../db/queries/tokens.js";

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
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        message: "You have logged in successfully."
    })
}

const refreshTokenController: ControllerType = async (req, res) => {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
        throw new CustomError(401, "Refresh token missing. Please log in.");
    }

    // hash the refresh token received from cookie
    const tokenHash = createHash("sha256").update(refresh_token).digest("hex");

    const refreshTokenFromDb = await getRefreshToken(tokenHash);

    // check if refresh token valid
    if(!refreshTokenFromDb ||
        refreshTokenFromDb.revoked_at != null || 
        new Date(refreshTokenFromDb.expires_at).getTime() < Date.now()
    ) {
        throw new CustomError(400, "Token has expired. Please log in.");
    }

    // if refresh token valid then generate new access token
    const accessToken = generateJwt({ sub: refreshTokenFromDb.user_id, role: refreshTokenFromDb.role });

    // rotate refresh token
    const rotatedRefreshToken = randomBytes(64).toString("hex");
    
    const rotatedRefreshTokenHash = createHash("sha256").update(rotatedRefreshToken).digest("hex");

    const isTokenRotated = await rotateRefreshToken({
        id: uuidv4(),
        userId: refreshTokenFromDb.user_id,
        tokenHash,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        rotatedRefreshTokenHash
    });

    if(!isTokenRotated) {
        throw new CustomError(500, "Failed to rotate refresh token in database.");
    }

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: NODE_ENV === "production",
        maxAge: 15 * 60 * 1000
    });

    res.cookie("refresh_token", rotatedRefreshToken, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        message: "Access token refreshed successfully."
    });
}

const logoutController: ControllerType = async (req, res) => {
    const { refresh_token } = req.cookies;

    // if refresh token is not revoked, revoke it and then clear cookies else simply clear cookies
    if (refresh_token) {
        const tokenHash = createHash("sha256").update(refresh_token).digest("hex");

        const isTokenRevoked = await revokeRefreshToken(tokenHash);

        if(!isTokenRevoked) {
            throw new CustomError(500, "Failed to log out.")
        }
    }

    res.clearCookie("access_token");

    res.clearCookie("refresh_token");

    res.status(200).json({
        message: "Logged out successfully."
    });
}

export default {
    registerUser: catchAsync(registerUser),
    loginUser: catchAsync(loginUser),
    refreshTokenController: catchAsync(refreshTokenController),
    logoutController: catchAsync(logoutController)
}