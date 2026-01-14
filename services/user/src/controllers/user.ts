import { prettifyError } from "zod";
import { addSkillToUser, deleteUserSkillMapping } from "../db/queries/skills.js";
import { fetchUserById, updateUserByUserId } from "../db/queries/users.js";
import catchAsync from "../utils/catchAsync.js";
import CustomError from "../utils/customError.js";
import { ControllerType } from "../utils/types.js";
import { profileSchema, skillSchema } from "./user.schema.js";

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
    const { userId, role } = req.user!;
    
    const profileDetails = req.body;

    const { success, error, data } = profileSchema.safeParse(profileDetails);

    if(!success) {
        throw new CustomError(400, prettifyError(error));
    }

    // parse resume

    // upload resume buffer to cloud storage and fetch asset Id

    // profile pic if changed do the same

    // get updated resume url, resume_id, profile_pic url, profile_pic_id

    const inputData = { ...data };

    const definedFields = Object.entries(inputData).filter((entry) => entry[1] !== undefined);

    if(definedFields.length === 0) {
        throw new CustomError(400, "No change detected in user data to update user profile.")
    }

    // dynamic update query
    
    const dataToUpdate: string[] = [];

    const dynamicQuery = definedFields.map((field, index) => {
        dataToUpdate.push(field[1]);
        return `${field[0]} = $${index + 2}`
    }).join(", ");

    await updateUserByUserId(userId, dynamicQuery, dataToUpdate);

    res.status(200).json({
        message: "User profile updated successfully"
    });
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
    getUserById: catchAsync(getUserById),
    addSkill: catchAsync(addSkill),
    deleteSkill: catchAsync(deleteSkill)
}