import catchAsync from "../utils/catchAsync.js";
import { ControllerType } from "../utils/types.js";

const registerUser: ControllerType = async (req, res, next) => {
    const { email } = req.body;
    res.status(200).json(email);
}

export default {
    registerUser: catchAsync(registerUser)
}