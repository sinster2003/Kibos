import { NextFunction, Request, Response } from "express";

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

export {
    ControllerType,
    UserCreatedPayload,
    UserCreatedEvent,
    JwtPayload
}