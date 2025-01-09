const express = require('express');
const messagesService = require('../services/messagesService')

// Entry Point: http://localhost:3000/messages
const router = express.Router();


router.get('/sender/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const messages = await messagesService.getAllSenderMessages(id);
        if (messages) {
            res.json(messages);
        } else {
            res.status(404).json({ error: 'Message not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving message' });
    }
});

router.get('/reciver/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const messages = await messagesService.getAllReciverMessages(id);
        if (messages) {
            res.json(messages);
        } else {
            res.status(404).json({ error: 'Message not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving message' });
    }
});

router.post('/history', async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const messages = await messagesService.getMessageHistory(senderId, receiverId);
        if (messages) {
            res.json(messages);
        } else {
            res.status(404).json({ error: 'Messages not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving messages' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { senderId, receiverId, content, timestamp } = req.body;
        const obj = { senderId, receiverId, content, timestamp };
        await messagesService.addMessage(obj);
        res.json({ obj });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error adding message' });
    }
});

module.exports = router;
