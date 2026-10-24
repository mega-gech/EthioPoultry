import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js"
import bcrypt from "bcryptjs";
import { env } from "node:process";
import { PreMiddlewareFunction } from "mongoose";

const createToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET;

    if(!secret){
        throw new Error("JWT_SECRET is not configured")
    }

    return jwt.sign(
        {userId},
        secret,
        {expiresIn: "1d"}
    );
};

export const registerUser = async(
    req: Request,
    res: Response
):Promise<void>=> {
    try {
        const {
            name,
            email,
            role,
            location,
            password,
            phone
        } = req.body

        if(!name || !email || !password){
            res.status(400).json({
                success: false,
                message: "name email password are required"
        })
        return
    }

        if(password.length < 4){
            res.status(400).json({
                success: false,
                message: "password must be at least 4 character"
            })
            return
        }

        if(
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ){
            res.status(400).json({
                success: false,
                message: "invalid inputs"
            })
        }

        const normalizedEmail = email.trim().tolowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        })

        if(existingUser){
            res.status(400).json({
                success: false,
                message: "email already registed"
            })
            return
        }

        const userRole = role === "seller"? "seller" : "buyer";
        const hashedPasword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPasword,
            role: userRole,
            location,
            phone
        })

        const token = createToken(user._id.toString());

        res.status(201).json({
            success: true,
            message: "registered successfully",
            token,
            user:{
                name: user.name,
                email: user.email,
                role: user.role,
                location: user.location,
                password: user.password,
                phone: user.phone
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "registeration failed"
        })
    }
} 

export const login = async(
    req: Request,
    res: Response
): Promise<void>=>{
    try {
        const {email, password} = req.body;

        if(
            typeof email !== "string"||
            typeof password !== "string"||
            !email.trim() ||
            !password
        ){
            res.status(400).json({
                success: false,
                message: "email and password required"
            })
            return
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select("+password");

        if(!user){
            res.status(400).json({
                success: false,
                message: "invalid email or password"
            })
            return
        }

        const passwordMaches = bcrypt.compare(
            password, user.password
        )

        if(!password){
            res.status(400).json({
                success: false,
                message: "invalid password or email"
            })
            return
        }

         const token = createToken(user._id.toString());

        res.status(201).json({
            success: true,
            message: "login successfully",
            token,
            user:{
                name: user.name,
                email: user.email,
                role: user.role,
                location: user.location,
                password: user.password,
                phone: user.phone
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "login failed"
        })
    }
}