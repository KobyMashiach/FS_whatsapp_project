const express = require('express');
const usersService = require('../services/usersService')

// Entry Point: http://localhost:3000/users
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const filters = req.query;
        const users = await usersService.getAllUsers(filters);
        res.json(users)
    } catch (err) {
        res.json(err)
    }
})

router.post('/', async (req, res) => {
    try {
        const { username, password, groups, blockedUsers } = req.body;
        const obj = { username, password, groups, blockedUsers };
        await usersService.addUser(obj);
        res.json({ obj });
    } catch (e) {
        console.error(e);
        if (e.code === 11000) {
            res.status(400).json({ error: `Username \'${req.body.username}\' already exists` });
        } else {
            res.status(500).json({ error: 'Error adding user' });
        }
    }
});

router.put('/block/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { blockedUserId, action } = req.body;

        if (action === 'add' || action === 'remove') {
            await usersService.updateUser(userId, blockedUserId, action);
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }

        res.json({ message: `User ${blockedUserId} has been ${action === 'add' ? 'blocked' : 'unblocked'}` });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error updating blocked users' });
    }
});


module.exports = router;