import { addSkillToUser, deleteUserSkillMapping } from "../db/queries/skills.js";
import { fetchUserById } from "../db/queries/users.js";
import catchAsync from "../utils/catchAsync.js";
import CustomError from "../utils/customError.js";
import { ControllerType } from "../utils/types.js";
import { skillPayload } from "./user.schema.js";

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

    const { success, error, data } = skillPayload.safeParse(skillDetails);

    if(!success) {
        throw new CustomError(400, error.message);
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
    getUserById: catchAsync(getUserById),
    addSkill: catchAsync(addSkill),
    deleteSkill: catchAsync(deleteSkill)
}