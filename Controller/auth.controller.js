import prisma from "../DB/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

class AuthController {
    static async register(req, res) {
        try {
            const { name, email, password, profile } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ success: false, message: "Missing parameters" })
            }
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const userData = {
                name: name,
                email: email,
                password: hash,
                profile: profile || ""
            }
            const checkExistingUser = await prisma.users.findUnique({
                where: {
                    email: email
                }
            })
            if (checkExistingUser) {
                return res.status(400).json({ success: false, messsage: "Email already exist" });
            }
            
            const user = await prisma.users.create({
                data: userData
            })
            return res.status(201).json({ success: true, message: "User registered successfully" });
        } catch (error) {
            console.log("error--->",error);
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, message: "Email and Password is required" });
            }

            const userData = await prisma.users.findUnique({
                where: {
                    email: email
                }
            });
            if (!userData) {
                return res.status(400).json({ success: false, message: "User does not exist" })
            }
            const checkPassword = bcrypt.compareSync(password, userData?.password);
            if (!checkPassword) {
                return res.status(400).json({ success: false, message: "Wrong password" })
            }
            jwt.sign({ id: userData?.id, name: userData?.name }, process.env.JWT_SECRET, { expiresIn: "30d" }, function (err, token) {
                if (err) {
                    return res.status(400).json({ success: false, message: "Something went wrong" })
                }
                const data = {
                    name: userData?.name,
                    email: userData?.email,
                    profile: userData?.profile,
                    token: token
                }
                return res.status(200).json({ success: true, message: "Login successfully", data });
            });
        } catch (error) {
            console.log("Error---->",error);
            return res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
}

export default AuthController;