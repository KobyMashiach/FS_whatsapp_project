const dbRepo = require('../repositories/dbRepo')
const wbRepo = require('../repositories/wbRepo')
const jsonfileRepo = require('../repositories/jsonfileRepo')

const Message = require('../models/messageModel')


const getAllSenderMessages = async (id) => {
    const data = await dbRepo.getAll(Message);
    const filteredMessages = data.filter(message => message.senderId === id);
    const uniqueReceiverIds = [...new Set(filteredMessages.map(message => message.receiverId))].slice(0, 20);
    return sortMessagesByTimestamp(filteredMessages.filter(message => uniqueReceiverIds.includes(message.receiverId)));
}

const getAllReciverMessages = async (id) => {
    const data = await dbRepo.getAll(Message);
    return sortMessagesByTimestamp(data.filter(message => message.receiverId === id));
}

const getMessageHistory = async (senderId, receiverId) => {
    const data = await dbRepo.getAll(Message);
    return sortMessagesByTimestamp(data.filter(message =>
        (message.receiverId === receiverId && message.senderId === senderId) ||
        (message.receiverId === senderId && message.senderId === receiverId)
    ));
}

const addMessage = (obj) => {
    return dbRepo.add(Message, obj);
}


// Function to sort messages by timestamp
const sortMessagesByTimestamp = (messages) => {
    return messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

module.exports = {
    getAllSenderMessages,
    getAllReciverMessages,
    getMessageHistory,
    addMessage,
}