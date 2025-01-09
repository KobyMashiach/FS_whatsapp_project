const dbRepo = require('../repositories/dbRepo')
const wbRepo = require('../repositories/wbRepo')
const jsonfileRepo = require('../repositories/jsonfileRepo')

const User = require('../models/userModel')


const getAllUsers = () => {
    return dbRepo.getAll(User);
}

const addUser = (obj) => {
    return dbRepo.add(User, obj);
}

const getUserById = (id) => {
    return dbRepo.getById(User, id);
}


const updateUser = async (id, blockedUserId, action) => {
    const user = await dbRepo.getById(User, id);
    if (!user) return null;

    const existingBlocks = new Set(user.blockedUsers);
    if (action == 'add') {
        if (!existingBlocks.has(blockedUserId)) {
            user.blockedUsers.push(blockedUserId);
        }
    } else {
        user.blockedUsers = user.blockedUsers.filter(userId => userId !== blockedUserId);
    }

    return dbRepo.update(User, id, user);
};


module.exports = {
    getAllUsers,
    addUser,
    updateUser,
}