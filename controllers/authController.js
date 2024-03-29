import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import * as authServices from "../services/authServices.js";


import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import jwt from "jsonwebtoken";

const avatarsPath = path.resolve("public", "avatars");

const { JWT_SECRET, BASE_URL } = process.env;

const signup = async (req, res) => {
    const { email } = req.body;
    const user = await authServices.findUser({ email });
    if (user) {
        throw HttpError(409, "Email in use");
    }
    const avatar = gravatar.url(email);
    const verificationToken = nanoid();

    const newUser = await authServices.signup({ ...req.body, avatarURL: avatar, verificationToken});

    const verifyEmail = {
        to: email,
        subject: "Verify email adress",
        html: `<a href="${BASE_URL}/api/users/verify/${verificationToken}" target="_blank">Click to verify</a>`
    }

    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
            avatarURL: avatar,
        }
        
    })
}

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await authServices.findUser({ verificationToken });
    if (!user) {
        throw HttpError(404, "User not found");
    }
    await authServices.updateUser({ _id: user._id }, { verify: true, verificationToken: " " })
    
    res.json({
        message: 'Verification successful',
    });
}

const resendVerify = async(req, res)=> {
    const {email} = req.body;
    const user = await authServices.findUser({email});
    if(!user) {
        throw HttpError(404, "Email not found");
    }
    if(user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email adress",
        html: `<a href="${BASE_URL}/api/users/verify/${user.verificationToken}" target="_blank">Click to verify</a>`
    };

    await sendEmail(verifyEmail);

    res.json({
        message: "Verification email sent"
    })
}

const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }
    if(!user.verify) {
        throw HttpError(401, "Email not verify");
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

const updateUserAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: oldPath, filename } = req.file;
    
    const newPath = path.join(avatarsPath, filename);
    await fs.rename(oldPath, newPath);

    const image = await Jimp.read(newPath);
    await image.resize(250, 250).writeAsync(newPath);
    const avatar = path.join("avatars", filename);
    const result = await authServices.updateUser(_id, {avatarURL: avatar});

    res.status(200).json(result);
}

export default {
    signup: ctrlWrapper(signup),
    verify: ctrlWrapper(verify),
    resendVerify: ctrlWrapper(resendVerify),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateUserAvatar: ctrlWrapper(updateUserAvatar),
}