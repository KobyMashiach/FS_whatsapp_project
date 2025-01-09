const dbRepo = require('../repositories/dbRepo')
const wbRepo = require('../repositories/wbRepo')
const jsonfileRepo = require('../repositories/jsonfileRepo')

const Group = require('../models/groupModel')

const getAllGroups = async () => {
    return dbRepo.getAll(Group);
}

const getGroupById = async (id) => {
    return dbRepo.getById(Group, id);
}

const getGroupByAdminId = async (id) => {
    return dbRepo.getOne(Group, { adminId: id });
}

const getGroupsByMemberId = async (id) => {
    const groups = await dbRepo.getAll(Group);
    return groups.filter(group => group.members.includes(id));
}

const updateGroupDynamic = async (id, name, members) => {
    const obj = { name, members }
    return dbRepo.update(Group, id, obj)
}
// const updateGroupDynamic = async (id, name, members) => {
//     const group = await dbRepo.getById(Group, id);
//     if (!group) return null;
//     const obj = { name, members: [group.adminId, ...members ?? []] }
//     return dbRepo.update(Group, id, obj)
// }

const updateGroup = async (id, deleteMembers = false, { name, members }) => {
    const group = await dbRepo.getById(Group, id);
    if (!group) return null;

    if (name) group.name = name;
    if (members) {
        const existingMembers = new Set(group.members);
        if (!deleteMembers) {
            const newMembers = members.filter(member => !existingMembers.has(member));
            group.members = [...group.members, ...newMembers];
        } else {
            group.members = group.members.filter(member => !members.includes(member));
            if (members.includes(group.adminId)) {
                if (group.members.length > 0) {
                    group.adminId = group.members[0];
                } else {
                    return dbRepo.remove(Group, id);
                }
            }
        }
    }

    return dbRepo.update(Group, id, group);
};

const addGroup = (obj) => {
    if (!obj.members) {
        obj.members = [obj.adminId];
    } else if (!obj.members.includes(obj.adminId)) {
        obj.members.push(obj.adminId);
    }
    return dbRepo.add(Group, obj);
}

const deleteGroup = (id) => {
    return dbRepo.remove(Group, id);
}


module.exports = {
    getAllGroups,
    getGroupById,
    getGroupByAdminId,
    getGroupsByMemberId,
    updateGroupDynamic,
    updateGroup,
    addGroup,
    deleteGroup,
}