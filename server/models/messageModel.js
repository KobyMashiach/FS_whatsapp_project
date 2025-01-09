const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        senderId: { type: String, required: true },
        receiverId: { type: String },
        groupId: { type: String },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    },
    { versionKey: false }
);

const Message = mongoose.model('message', messageSchema, 'messages');

module.exports = Message;
