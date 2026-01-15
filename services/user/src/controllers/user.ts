import axios from "axios";
import { prettifyError } from "zod";
import { addSkillToUser, deleteUserSkillMapping } from "../db/queries/skills.js";
import { fetchAvatarIdByUserId, fetchResumeIdByUserId, fetchUserById, updateUserByUserId } from "../db/queries/users.js";
import catchAsync from "../utils/catchAsync.js";
import CustomError from "../utils/customError.js";
import { ControllerType } from "../utils/types.js";
import { profileSchema, skillSchema } from "./user.schema.js";
import { UPLOAD_SERVICE_BASE_URL } from "../config/index.js";

const getMyProfile: ControllerType = async (req, res) => {
    const { userId } = req.user!;

    const fetchedUser = await fetchUserById(userId);

    if(!fetchedUser) {
        throw new CustomError(404, "User not found in database");
    }

    res.status(200).json({
        user: fetchedUser,
        message: "User retrieved successfully"
    });
}

const updateMyProfile: ControllerType = async (req, res) => {
    const { userId } = req.user!;
    
    const profileDetails = req.body;

    const { success, error, data } = profileSchema.safeParse(profileDetails);

    if(!success) {
        throw new CustomError(400, prettifyError(error));
    }

    const definedFields = Object.entries(data).filter((entry) => entry[1] !== undefined);

    if(definedFields.length === 0) {
        throw new CustomError(400, "No change detected in user data to update user profile.")
    }

    // dynamic update query
    
    const dataToUpdate: string[] = [];

    const dynamicQuery = definedFields.map((field, index) => {
        dataToUpdate.push(field[1]);

        // camel case to snake case
        const sqlField = field[0].replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);

        return `${sqlField} = $${index + 2}`
    }).join(", ");

    const isUserUpdated = await updateUserByUserId(userId, dynamicQuery, dataToUpdate);

    if(!isUserUpdated) {
        throw new CustomError(500, "Failed to update user profile.");
    }

    res.status(200).json({
        message: "User profile updated successfully"
    });
}

const updateMyResume: ControllerType = async (req, res) => {
    const { userId } = req.user!;
    const resume = req.file;

    if(!resume) {
        throw new CustomError(400, "Resume not provided. Resume is not updated.");
    }

    const isResumeIdFetched = await fetchResumeIdByUserId(userId);

    if(!isResumeIdFetched) {
        throw new CustomError(404, "Logged in user and resume id not present in the database.");
    }

    // synchronous network call to upload asset in cloud storage service
    const result = await axios.post(`${UPLOAD_SERVICE_BASE_URL}/api/utils/upload`, {
        file: `data:${resume.mimetype};base64,${resume.buffer.toString("base64")}`,
        previousAssetId: isResumeIdFetched.resume_id
    });

    // update in users table
    const { url, assetId } = await result.data;

    if(!url || !assetId) {
        throw new CustomError(500, "Failed to upload the resume.");
    }

    const isResumeUpdated = await updateUserByUserId(userId, "resume = $2, resume_id = $3", [url, assetId]);

    if(!isResumeUpdated) {
        throw new CustomError(500, "Failed to update the resume.");
    }

    res.status(200).json({
        message: "Resume updated successfully."
    })
}

const updateMyAvatar: ControllerType = async (req, res) => {
    const { userId } = req.user!;
    const avatar = req.file;

    if(!avatar) {
        throw new CustomError(400, "Avatar not provided. Avatar is not updated.");
    }

    const isAvatarIdFetched = await fetchAvatarIdByUserId(userId);

    if(!isAvatarIdFetched) {
        throw new CustomError(404, "Logged in user and avatar id not present in the database.");
    }

    // synchronous network call to upload asset in cloud storage service
    const result = await axios.post(`${UPLOAD_SERVICE_BASE_URL}/api/utils/upload`, {
        file: `data:${avatar.mimetype};base64,${avatar.buffer.toString("base64")}`,
        previousAssetId: isAvatarIdFetched.profile_pic_id
    });

    // update in users table
    const { url, assetId } = await result.data;

    if(!url || !assetId) {
        throw new CustomError(500, "Failed to upload the avatar.");
    }

    const isAvatarUpdated = await updateUserByUserId(userId, "profile_pic = $2, profile_pic_id = $3", [url, assetId]);

    if(!isAvatarUpdated) {
        throw new CustomError(500, "Failed to update the avatar.");
    }

    res.status(200).json({
        message: "Avatar updated successfully."
    })
}

const getUserById: ControllerType = async (req, res) => {
    const { userId } = req.params;

    const fetchedUser = await fetchUserById(userId);

    if(!fetchedUser) {
        throw new CustomError(404, "User not found in database");
    }

    res.status(200).json({
        user: fetchedUser,
        message: "User retrieved successfully"
    });
}

const addSkill: ControllerType = async (req, res) => {
    const { userId } = req.user!;

    const skillDetails = req.body;

    const { success, error, data } = skillSchema.safeParse(skillDetails);

    if(!success) {
        throw new CustomError(400, prettifyError(error));
    }

    const { skill } = data;

    await addSkillToUser({ userId, skill });

    res.status(201).json({
        message: "Skill added successfully."
    });
}

const deleteSkill: ControllerType = async (req, res) => {
    const { userId } = req.user!;

    const { skillId } = req.params;

    if(!skillId) {
        throw new CustomError(400, "Invalid skill id.")
    }

    const isSkillDeleted = await deleteUserSkillMapping({ userId, skillId });

    if(!isSkillDeleted) {
        throw new CustomError(404, "The skill is not found to be associated with the logged in user.");
    }

    res.status(200).json({
        message: "Skill deleted successfully."
    });
}

export default {
    getMyProfile: catchAsync(getMyProfile),
    updateMyProfile: catchAsync(updateMyProfile),
    updateMyResume: catchAsync(updateMyResume),
    updateMyAvatar: catchAsync(updateMyAvatar),
    getUserById: catchAsync(getUserById),
    addSkill: catchAsync(addSkill),
    deleteSkill: catchAsync(deleteSkill)
}