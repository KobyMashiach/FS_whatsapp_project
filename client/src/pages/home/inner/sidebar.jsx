import axios from 'axios';
import { useState, useEffect } from 'react';
import { UserSidebarComp, GroupSidebarComp } from './sidebar_menus';
import CreateGroupDialog from '../../../widgets/create_group_dialog';

function SideBarComp({ loginUser, users, groups, onUserTap, onGroupTap, onUserBlockTap, onAddNewGroup }) {

    const [categoryDisplay, setCategoryDisplay] = useState('users');
    const [createGroupDialog, setCreateGroupDialog] = useState(false);


    const categoriesChoose = <div style={{ display: 'flex', justifyContent: 'space-between', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer', backgroundColor: categoryDisplay == 'users' ? 'greenyellow' : null }} onClick={() => setCategoryDisplay('users')}>
            Users
        </div>
        <div style={{ width: '1px', backgroundColor: 'black' }}></div>
        <div style={{ flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer', backgroundColor: categoryDisplay == 'groups' ? 'greenyellow' : null }} onClick={() => setCategoryDisplay('groups')}>
            Groups
        </div>
        <div style={{ width: '1px', backgroundColor: 'black' }}></div>
        <div style={{ flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer', backgroundColor: categoryDisplay == 'blocks' ? 'greenyellow' : null }} onClick={() => setCategoryDisplay('blocks')}>
            Blocks
        </div>
    </div>;

    const handleSaveGroup = async (groupName, selectedUsers) => {
        const body = {
            name: groupName,
            adminId: loginUser._id,
            members: selectedUsers.map(user => user._id)
        };
        const resp = await axios.post('http://localhost:3000/groups', body);
        console.log(resp.data);
        onAddNewGroup(resp.data)
        setCreateGroupDialog(false);
    }


    return (
        <>
            {categoriesChoose}<br />
            {categoryDisplay == 'users' && users && users.map(user => {
                if (user.username !== loginUser.username && loginUser.blockedUsers && !loginUser.blockedUsers.includes(user._id))
                    return (
                        <UserSidebarComp key={user._id} user={user} callback={onUserTap} />
                    )
            })}
            {categoryDisplay == 'groups' && (
                <div style={{ textAlign: 'center' }}>
                    <button onClick={() => setCreateGroupDialog(true)}>Add Group</button>
                    {groups && groups.map(group => (
                        <GroupSidebarComp key={group._id} group={group} callback={onGroupTap} />
                    ))}
                </div>
            )}
            {categoryDisplay == 'blocks' && loginUser.blockedUsers && users.map(user => {
                if (loginUser.blockedUsers.includes(user._id))
                    return (
                        <UserSidebarComp key={user._id} user={user} callback={onUserBlockTap} />
                    )
            })}

            {createGroupDialog && <CreateGroupDialog
                users={users.filter(user => user.username !== loginUser.username)}
                oldSelectedUsers={[]}
                onSave={handleSaveGroup}
                onCancel={() => setCreateGroupDialog(false)}
            />}

        </>
    );
}

export default SideBarComp;