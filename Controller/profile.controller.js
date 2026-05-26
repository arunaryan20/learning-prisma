import res from "express/lib/response.js";
import prisma from "../DB/db.config.js";
import { imageValidator } from "../utils/helper.js";

class ProfileController {
    static async getUsers(req, res) {
        try {
            let { page = 1, limit = 5, search = "" } = req.query;
            page = Number(page);
            limit = Number(limit);
            const skip = (page - 1) * limit;
            //search filter
            const searchFilter = search ? {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },
                    {
                        email: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                ]
            } : {};
            const totalUsers=await prisma.Users.count({where:searchFilter});
            const userData=await prisma.Users.findMany({
                where:searchFilter,
                skip:skip,
                take:limit,
                orderBy:{
                    created_at:"desc"
                },
                select:{
                    name:true,
                    email:true,
                    profile:true,
                    created_at:true,
                    updated_at:true,
                }
            })

            return res.status(200).json({ success: true,
                 message: "Users fetched succesfully",
                 total:totalUsers,
                 currentPage:page,
                 totalPages:Math.ceil(totalUsers/limit),
                 limit:limit,
                 users:userData
                });
        } catch (error) {
            console.log("Error---->",error);
            return res.status(500).json({ success: false, message: "Internal server Error" })
        }
    }
    static async createUser() {
        try {
            // Use create method same as in auth controller
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server Error" })
        }
    }
    static async getUserDetails() {
        try {
            // User findUnique method
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

            await prisma.Users.update({
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
            const userData = await prisma.Users.findUnique({
                where: {
                    id: Number(id)
                }
            })
            if (!userData) {
                return res.status(400).json({ success: false, message: "User not found" })
            }

            await prisma.Users.delete({
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