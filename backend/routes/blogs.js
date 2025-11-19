const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const jwt = require("jsonwebtoken");

// JWT Auth Middleware
function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // user id inside token
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
}

// Create Blog
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

// Public route → get all blogs for home page
router.get("/all", async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching blogs" });
    }
});

// Load User Blogs
router.get("/myblogs", auth, async (req, res) => {
    try {
        const blogs = await Blog.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching blogs" });
    }
});

// Get Full Blog
router.get("/:id", auth, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        res.json({ success: true, blog });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching blog" });
    }
});

module.exports = router;
