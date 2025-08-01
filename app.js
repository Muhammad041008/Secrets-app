require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const authRoutes = require("./routes/authRoutes");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(express.static("public")); // Serve static files
app.set("view engine", "ejs"); // Set view engine to EJS

// Session setup
app.use(session({
    secret: process.env.SECRET_KEY, // Secret key for session
    resave: false,
    saveUninitialized: true
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));

// Routes
app.use(authRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
