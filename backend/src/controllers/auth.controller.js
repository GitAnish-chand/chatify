import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
        // Check empty fields
        if (!fullname || !email || !password) {
            return res
                .status(400)
                .json({ message: "All fields are required" });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long",
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format",
            });
        }

        // Check if user already exists
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
        });


        const savedUser = await newUser.save();
        generateToken(savedUser._id, res);

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: savedUser._id,
                fullname: savedUser.fullname,
                email: savedUser.email,
                profilePic: savedUser.profilePic,
            },
        });

        try {
            await sendWelcomeEmail(savedUser.email, savedUser.fullname, ENV.CLIENT_URL);
        } catch (error) {
            console.error("Error sending welcome email:", error.message);
        }

    } catch (error) {
        console.log("Signup Error:", error.message);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        generateToken(user._id, res);

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                profilePic: user.profilePic,
            },
        });

    } catch (error) {

        console.log("Login Error:", error.message);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const logout = (req, res) => {

    try {
        res.cookie('token', '', {
            maxAge: 0,
            httpOnly: true,
            samesite: 'strict',
            secure: ENV.NODE_ENV === 'development' ? false : true,
        });
        res.status(200).json({
            message: "Logout successful",
        });
    } catch (error) {
        console.log("Logout Error:", error.message);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const updateProfile = async (req, res) => {

    try {
        const { profilePic } = req.body;
        if (!profilePic) return res.status(400).json({ message: "Profile picture is required" });
        const userId = req.user._id;
        const uploadRespobse = await cloudinary.uploader.upload(profilePic, {
            folder: "chatify/profilePics",
            public_id: `${userId}_${Date.now()}`,
            overwrite: true,
        });
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        ).select("-password");

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                fullname: updatedUser.fullname,
                email: updatedUser.email,
                profilePic: updatedUser.profilePic,
            },
        });
    } catch (error) {
        console.log("Update Profile Error:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};




