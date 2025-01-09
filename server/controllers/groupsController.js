const express = require('express');
const groupsService = require('../services/groupsService')

// Entry Point: http://localhost:3000/groups
const router = express.Router();



//  Get all groups
router.get('/', async (req, res) => {
    try {
        const groups = await groupsService.getAllGroups();
        if (groups) {
            res.json(groups);
        } else {
            res.status(404).json({ error: 'Group not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving group' });
    }
});

// Get group by member ID
router.get('/member/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const groups = await groupsService.getGroupsByMemberId(id);
        if (groups) {
            res.json(groups);
        } else {
            res.status(404).json({ error: 'Group not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving group' });
    }
});

// Update group dynamic by ID
router.put('/dynamic/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, members } = req.body;

        const updatedGroup = await groupsService.updateGroupDynamic(id, name, members);

        if (!updatedGroup) {
            return res.status(404).json({ error: 'Group not found' });
        }

        res.json({ message: 'Group updated', group: updatedGroup });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error updating group' });
    }
});

// Update group by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, members, deleteMembers } = req.body;

        const updatedGroup = await groupsService.updateGroup(id, deleteMembers, { name, members });

        if (!updatedGroup) {
            return res.status(404).json({ error: 'Group not found' });
        }

        res.json({ message: 'Group updated', group: updatedGroup });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error updating group' });
    }
});


//Remove Group member by ID
router.put('/removeMembers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { members } = req.body;

        const updatedGroup = await groupsService.updateGroup(id, false, { members });

        if (!updatedGroup) {
            return res.status(404).json({ error: 'Group not found' });
        }

        res.json({ message: 'Group member removed', group: updatedGroup });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error removing group member' });
    }
});




// Delete group by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await groupsService.deleteGroup(id);
        res.json({ message: 'Group deleted' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error deleting group' });
    }
});


// Create a new group
router.post('/', async (req, res) => {
    try {
        const { name, adminId, members } = req.body;
        const obj = { name, adminId, members };
        const resp = await groupsService.addGroup(obj);
        res.json(resp);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error adding group' });
    }
});

module.exports = router;
