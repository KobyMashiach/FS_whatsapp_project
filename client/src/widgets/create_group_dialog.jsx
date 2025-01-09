import { useState, useEffect } from 'react';

function CreateGroupDialog({ users, oldGroupName = "", oldSelectedUsers = [], onSave, onCancel }) {
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        setGroupName(oldGroupName);
        setSelectedUsers(oldSelectedUsers);
    }, [oldGroupName, oldSelectedUsers]);

    const handleSave = () => {
        if (groupName.trim()) {
            onSave(groupName, selectedUsers);
        } else {
            alert('Please enter a group name.');
        }
    };

    const toggleUserSelection = (user) => {
        if (selectedUsers.includes(user)) {
            setSelectedUsers(selectedUsers.filter((u) => u !== user));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <div
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#fff',
                    padding: '20px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    zIndex: 1000,
                    width: '300px',
                }}
            >
                <h3 style={{ margin: 0, marginBottom: '10px' }}>Enter Group Name</h3>
                <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    maxLength={30}
                    style={{
                        width: '80%',
                        padding: '10px',
                        marginBottom: '20px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                    placeholder="Group Name"
                />

                <h4 style={{ marginBottom: '10px' }}>Select Users</h4>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        marginBottom: '20px',
                        gap: '5px',
                        justifyContent: 'center',
                    }}
                >
                    {users.map((user) => (
                        <button
                            key={user._id}
                            onClick={() => toggleUserSelection(user)}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: selectedUsers.includes(user)
                                    ? '#007bff'
                                    : '#f0f0f0',
                                color: selectedUsers.includes(user) ? '#fff' : '#000',
                                border: '1px solid #ccc',
                                borderRadius: '16px',
                                cursor: 'pointer',
                            }}
                        >
                            {user.username}
                        </button>
                    ))}
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <button
                        onClick={handleSave}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#5cb85c',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Save
                    </button>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#d9534f',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 999,
                }}
                onClick={onCancel}
            />
        </div>
    );
}

export default CreateGroupDialog;
