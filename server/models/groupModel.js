const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        adminId: { type: String, required: true },
        members: { type: [String], default: [] }
    },
    { versionKey: false }
);

const Group = mongoose.model('group', groupSchema, 'groups');

module.exports = Group;
