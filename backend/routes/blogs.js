const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const jwt = require("jsonwebtoken");

// ----------------------------
// JWT AUTH MIDDLEWARE
// ----------------------------
function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
}

// ----------------------------
// CREATE BLOG (AUTH REQUIRED)
// ----------------------------
router.post("/create", auth, async (req, res) => {
    try {
        const { title, content } = req.body;

        const newBlog = new Blog({
            userId: req.user.id,
            title,
            content
        });

        await newBlog.save();

        res.json({ success: true, blog: newBlog });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error creating blog" });
    }
});

// ----------------------------
// PUBLIC — GET ALL BLOGS
// ----------------------------
router.get("/all", async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("userId", "fullName username email")
            .sort({ createdAt: -1 });

        res.json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching blogs" });
    }
});

// ----------------------------
// GET USER'S OWN BLOGS (AUTH REQUIRED)
// ----------------------------
router.get("/myblogs", auth, async (req, res) => {
    try {
        const blogs = await Blog.find({ userId: req.user.id })
            .populate("userId", "fullName username")
            .sort({ createdAt: -1 });

        res.json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching blogs" });
    }
});

// ----------------------------
// PUBLIC — GET FULL BLOG BY ID
// ----------------------------
router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate("userId", "fullName username email");

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        res.json({ success: true, blog });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching blog" });
    }
});

// UPDATE BLOG (AUTH REQUIRED)
router.put("/update/:id", auth, async (req, res) => {
    try {
        const { title, content } = req.body;

        const blog = await Blog.findById(req.params.id);

        if (!blog){
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        if (blog.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        blog.title = title;
        blog.content = content;
        await blog.save();

        res.json({ success: true, message: "Blog updated", blog });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating blog" });
    }
});

// DELETE BLOG (AUTH REQUIRED)
router.delete("/delete/:id", auth, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog){
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        if (blog.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        await blog.deleteOne();

        res.json({ success: true, message: "Blog deleted" });
    }catch (error) {
        res.status(500).json({ success: false, message: "Error deleting blog" });
    }
});

module.exports = router;