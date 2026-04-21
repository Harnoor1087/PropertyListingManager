const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,         // Every user must have a username
    },
    email: {
        type: String,
        required: true,
        unique: true,           // No two users can share the same email
    },
    password: {
        type: String,
        required: true,         // We'll store the bcrypt hash here, never plain text
    },
});

const User = mongoose.model("User", userSchema);
module.exports = User;