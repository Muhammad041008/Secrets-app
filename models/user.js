const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    secretMessage: { type: String, default: "" } // New field for the user's message
});

const User = mongoose.model("User", userSchema);

module.exports = User;
