import { NextFunction, Request, Response } from "express";
import { InferSelectModel } from "drizzle-orm";
import { usersTable } from "../db/schema.js";
import { string } from "zod";

type ControllerType = (req: Request, res: Response, next: NextFunction) => Promise<any>;

enum userRole {
    jobseeker = "jobseeker",
    recruiter = "recruiter"
}

interface UserCreatedPayload {
    userId: string;
    name: string;
    email: string;
    role: userRole
}

interface UserCreatedEvent {
    eventType: string;
    eventId: string;
    timestamp: string;
    payload: UserCreatedPayload;
}

interface JwtPayload {
    sub: string,
    role: userRole.jobseeker | userRole.recruiter,
    iat: number,
    exp: number,
    aud: string,
    iss: string
}

interface AuthenticatedUser {
    userId: string;
    role: string;
}

type RetrievedUser = InferSelectModel<typeof usersTable>

interface RetrievedUserFromDatabase extends Omit<RetrievedUser, "userId" | "phoneNo" | "resumeId" | "profilePic" | "profilePicId"> {
    user_id: string;
    phone_no: string;
    resume_id: string;
    profile_pic: string;
    profile_pic_id: string;
}

interface UserSkillPayload {
    userId: string,
    skill: string,
    skillId: string
}

export {
    ControllerType,
    UserCreatedPayload,
    UserCreatedEvent,
    JwtPayload,
    AuthenticatedUser,
    RetrievedUser,
    RetrievedUserFromDatabase,
    UserSkillPayload
}