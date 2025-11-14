const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, username, password } = req.body;

        // checking if user exists
        const exists = await User.findOne({ $or: [{ email }, { username }] });
        if (exists) return res.status(400).json({success: false, message: "User already exists"});

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            fullName,
            email,
            username,
            password: hashedPassword
        });

        await newUser.save();

        res.json({success: true, message: "Signup successful"});
    } catch (error) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        // Compare password
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ success: false, message: "Incorrect password" });

        // Create JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Verifying token
router.get('/verify', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.json({ success: false });

        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.json({ success: false });
            res.json({ success: true, userId: decoded.id });
        });
    }catch (error) {
        res.json({ sucess: false });
    }
});

module.exports = router;