
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Create a JWT for an authenticated user.
const createToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign(
        { userId },
        secret,
        { expiresIn: "1d" }
    );
};

// REGISTER
export const register = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            name,
            email,
            password,
            role,
            location,
            phone
        } = req.body;

        // 1. Check required fields.
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            res.status(400).json({
                success: false,
                message: "Name, email, and password are required"
            });
            return;
        }

        // 2. Enforce a minimum password length.
        if (password.length < 4) {
            res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
            return;
        }

        // 3. Normalize the email.
        const normalizedEmail = email.trim().toLowerCase();

        // 4. Check whether the email is already registered.
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
            return;
        }

        // 5. Allow buyer or seller registration, not admin.
        const userRole =
            role === "seller" ? "seller" : "buyer";

        // 6. Hash the password before saving it.
        const hashedPassword = await bcrypt.hash(password, 12);

        // 7. Create the user in MongoDB.
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: userRole,
            location,
            phone
        });

        // 8. Create an authentication token.
        const token = createToken(user._id.toString());

        // 9. Return safe user details.
        res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                location: user.location,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};

// LOGIN
export const login = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email, password } = req.body;

        // 1. Validate the submitted credentials.
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
            return;
        }

        // 2. Find the user and explicitly retrieve the password hash.
        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select("+password");

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
            return;
        }

        // 3. Compare the submitted password with the stored hash.
        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
            return;
        }

        // 4. Create a token after successful verification.
        const token = createToken(user._id.toString());

        // 5. Return safe user details.
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                location: user.location,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};
