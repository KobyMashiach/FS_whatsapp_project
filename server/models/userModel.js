const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        groups: { type: [String], default: [] },
        blockedUsers: { type: [String], default: [] },
    },
    { versionKey: false }
);

const User = mongoose.model('user', userSchema, 'users');

module.exports = User;
