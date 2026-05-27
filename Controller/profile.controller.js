import prisma from "../DB/db.config.js";
import { imageValidator } from "../utils/helper.js";

class ProfileController {
    static async getUserDetails(req,res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ success: false, message: "Missing user id" })
            }
            const userData = await prisma.users.findUnique({
                where: {
                    id: Number(id)
                },
                select:{
                    id:true,
                    name:true,
                    email:true,
                    profile:true,
                    created_at:true,
                    updated_at:true
                }
            })
            if (!userData) {
                return res.status(400).json({ success: false, message: "User not found" })
            }
            return res.status(200).json({ success: true, message: "User fetched successfully", data: userData })
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server Error" })
        }
    }
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const authUser = req.user;
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({ success: false, message: "Profile image is required" });
            }
            const profile = req.files.profile;
            const message = imageValidator(profile?.size, profile?.mimetype);
            if (message !== null) {
                return res.status(400).json({ success: false, message: message })
            }
            const imageName = Date.now() + profile.name;
            const uploadPath = process.cwd() + "/public/images/" + imageName;
            profile.mv(uploadPath, (err) => {
                if (err) throw err
            })

            await prisma.users.update({
                data: {
                    profile: imageName
                },
                where: {
                    id: Number(id)
                }
            })
            return res.status(200).json({ success: true, message: "Profile updated successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server Error" })
        }
    }
    static async deleteUser(req, res) {
        try {

            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ success: false, message: "User id is required" });
            }
            const userData = await prisma.users.findUnique({
                where: {
                    id: Number(id)
                }
            })
            if (!userData) {
                return res.status(400).json({ success: false, message: "User not found" })
            }

            await prisma.users.delete({
                where: {
                    id: Number(id)
                }
            })
            return res.status(200).json({ success: true, message: "User deleted successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server Error" })
        }
    }
}
export default ProfileController;