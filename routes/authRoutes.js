const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const router = express.Router();

// Home Route
router.get("/", (req, res) => {
    res.render("home");
});

// Registration Page
router.get("/register", (req, res) => {
    res.render("register");
});

// Registration Logic
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.render("register-success", { username });
    } catch (error) {
        console.error("Registration Error:", error);
        res.render("register", { errorMessage: "User already exists or error occurred!" });
    }
});

// Login Page
router.get("/login", (req, res) => {
    res.render("login");
});

// Login Logic
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.render("login", { errorMessage: "User not found!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            req.session.userId = user._id; // Store user ID in session
            res.redirect("/secrets");
        } else {
            res.render("login", { errorMessage: "Incorrect password!" });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.render("login", { errorMessage: "An error occurred during login." });
    }
});

// Secrets Page (Show message and form)
router.get("/secrets", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    try {
        const user = await User.findById(req.session.userId);
        res.render("secrets", { secretMessage: user.secretMessage });
    } catch (error) {
        console.error("Secrets Page Error:", error);
        res.redirect("/login");
    }
});

// Save the secret message
router.post("/secrets", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    const { message } = req.body;

    try {
        await User.findByIdAndUpdate(req.session.userId, { secretMessage: message });
        res.redirect("/secrets");
    } catch (error) {
        console.error("Error saving message:", error);
        res.redirect("/secrets");
    }
});

// Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

module.exports = router;
