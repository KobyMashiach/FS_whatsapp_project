import { useState } from 'react';

function UserSidebarComp({ user, callback }) {
    const [height] = useState(window.innerHeight / 20);

    return (
        <div
            style={{ height: `${height}px`, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
            onClick={() => callback(user)}
        >
            {user.username}
            <br />
            <div style={{ height: '1px', width: '100%', backgroundColor: 'black' }}></div>
        </div>
    );
}

function GroupSidebarComp({ group, callback }) {
    const [height] = useState(window.innerHeight / 20);

    return (
        <div
            style={{ height: `${height}px`, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
            onClick={() => callback(group)}
        >
            {group.name}
            <br />
            <div style={{ height: '1px', width: '100%', backgroundColor: 'black' }}></div>
        </div>
    );
}



export { UserSidebarComp, GroupSidebarComp };