import fs from "fs/promises";
import path from "path";
import * as authServices from "../services/authServices.js";


import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";

const avatarsPath = path.resolve("public", "avatars");

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
    const { email } = req.body;
    const user = await authServices.findUser({ email });
    if (user) {
        throw HttpError(409, "Email in use");
    }
    const avatar = gravatar.url(email);

    const newUser = await authServices.signup({ ...req.body, avatarURL: avatar });

    

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
            avatarURL: avatar,
        }
        
    })
}

const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    const comparePassword = await authServices.validatePassword(password, user.password);
    if (!comparePassword) {
        throw HttpError(401, "Email or password is wrong");
    }

    const { _id: id } = user;
    const payload = {
        id,
    }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await authServices.updateUser({ _id: id }, { token });

    res.json({
        token,
    });
}

const getCurrent = async (req, res) => {
    const { email } = req.user;

    res.json({
        email
    })
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await authServices.updateUser({ _id }, { token: "" });
    
    res.status(204);
}

// const updateUserAvatar = async (req, res) => {
//     const { _id } = req.user;
//     const {path: oldPath, filename} = req.file;
//     const newPath = path.join(avatarsPath, filename);
//     await fs.rename(oldPath, newPath);
//     const avatar = path.join("avatars", filename);
//     const result = await authServices.updateUserAvatar({ _id }, {avatarURL: avatar});

//     res.status(200).json(result);
// }

export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    // updateUserAvatar: ctrlWrapper(updateUserAvatar),
}