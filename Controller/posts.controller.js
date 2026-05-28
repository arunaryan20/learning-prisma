import prisma from "../DB/db.config.js"

class Posts {
    static async createPost(req, res) {
        try {
            const { title, desc, userId } = req.body;
            if (!title || !userId || !desc) {
                return res.status(400).json({ success: false, message: "Missing require fields" });
            }
            const data = {
                title: title,
                desc: desc,
                userId: Number(userId)
            }
            await prisma.posts.create({
                data: data
            })
            return res.status(201).json({ success: true, message: "Post created successfully" });

        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    static async getPostDetails(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ success: false, message: "Post id is required" })
            }
            const postData = await prisma.posts.findUnique({
                where: {
                    id: Number(id)
                }
            })
            if (!postData || postData?.deleted == true) {
                return res.status(400).json({ success: false, message: "Post not found" })
            }
            return res.status(200).json({ success: true, message: "Post details fetched successfully", data: postData });

        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    static async getAllPost(req, res) {
        try {
            let { page = 1, limit = 5, search = "" } = req.query;
            const userId =req.user.id;
            page = Number(page);
            limit = Number(limit);
            const skip = (page - 1) * limit;
            const searchFilter = {
                deleted: false,
                userId:userId,
                ...(search && {
                    title: {
                        contains: search,
                        mode: "insensitive"
                    }
                })
            }
            const postData = await prisma.posts.findMany({
                where: searchFilter,
                skip: skip,
                take: limit,
                include: {
                    user: true
                },
                orderBy: {
                    id: "desc"
                }
            })
            const totalPost = await prisma.posts.count({
                where: searchFilter
            })
            return res.status(200).json({
                success: true,
                message: "Posts fetched successfully",
                data: postData,
                total: totalPost,
                page: page,
                limit: limit,
                totalPages: Math.ceil(totalPost / limit)
            })

        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    static async updatePost(req, res) {
        try {
            const { id } = req.params;
            const { title,desc } = req.body;
            if (!id) {
                return res.status(400).json({ success: false, messag: "Post id is required" });
            }
            if (!title || !desc) {
                return res.status(400).json({ success: false, message: "title is required" })
            }
            const postData = await prisma.posts.findUnique({
                where: {
                    id: Number(id)
                }
            })
            if (!postData || postData?.deleted === true) {
                return res.status(400).json({ success: false, message: "Post not found" });
            }
            await prisma.posts.update({
                data: {
                    title: title,
                    desc:desc
                },
                where: {
                    id: Number(id)
                }
            })
            return res.status(200).json({ success: true, message: "Post updated successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    static async deletePost(req, res) {
        try {
            const { id } = req.params;
            console.log("id---->",id);
            if (!id) {
                return res.status(400).json({ success: false, message: "Post id is required" })
            }
            const postData = await prisma.posts.findUnique({
                where: {
                    id: Number(id)
                }
            })
            if (!postData || postData?.deleted == true) {
                return res.status(400).json({ success: false, message: "Post not found" });
            }
            await prisma.posts.delete({
                where: {
                    id: Number(id)
                }
            })
            return res.status(200).json({ success: true, message: "Post deleted successfully" });

        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}

export default Posts;