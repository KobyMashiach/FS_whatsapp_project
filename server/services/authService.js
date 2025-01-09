const dbRepo = require('../repositories/dbRepo')
const wbRepo = require('../repositories/wbRepo')
const jsonfileRepo = require('../repositories/jsonfileRepo')

const User = require('../models/userModel')


const verifyUser = async (userName, password) => {
    const users = await dbRepo.getAll(User);
    const user = users.find(user => user.username == userName && user.password == password
    )
    if (user) {
        return user;
    }
    return null;
}

module.exports = {
    verifyUser,
}