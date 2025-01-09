const express = require('express')
const jwt = require('jsonwebtoken')

const router = express.Router()

// Entry Point: //http://localhost:3000/auth

const authService = require('../services/authService')

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await authService.verifyUser(username, password);

    if (user) {
        const userId = user.id
        const SECRET_KEY = 'some_key'
        const token = jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: "30m" });
        res.json({ token, user })
    } else {
        res.status(404).json("User don't found")
    }


})

module.exports = router