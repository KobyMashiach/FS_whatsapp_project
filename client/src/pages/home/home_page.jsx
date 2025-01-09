import { act, useEffect, useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './home_page.css';
import SideBarComp from './inner/sidebar';
import ChatUserComp from './inner/chat_user';
import ChatGroupComp from './inner/chat_group';
import UnblockComp from './inner/block_unblock';
import RefreshButton from '../../widgets/refresh_button';


function HomePageComp() {
    const navigate = useNavigate();
    let content;

    const [loginUser, setLoginUser] = useState();
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);


    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedBlockUser, setSelectedBlockUser] = useState(null);


    useEffect(() => {
        const getAllUsers = async () => {
            const { data } = await axios.get('http://localhost:3000/users');
            setUsers(data.filter(user => user.username));
            setLoginUser(data.find(user => user.username === sessionStorage.getItem('username')));
        }

        const getAllGroups = async () => {
            const { data } = await axios.get('http://localhost:3000/groups/member/' + sessionStorage.getItem('id'));
            setGroups(data);
        }
        getAllGroups();
        getAllUsers();
    }, []);


    //check if token exists and if it's expired
    useEffect(() => {
        const checkToken = () => {
            const token = sessionStorage.getItem('token');

            if (!token) {
                navigate('/');
                return;
            }

            const isTokenExpired = (token) => {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                return decodedToken.exp < currentTime;
            };

            if (isTokenExpired(token)) {
                alert('Session expired. Please login again.');
                navigate('/');
                return;
            }
        };

        checkToken();
    }, [navigate]);

    //on escape key press, close the selected user
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                setSelectedUser(null);
                setSelectedGroup(null);
            }
        };

        window.addEventListener('keydown', handleEscKey);


        return () => {
            window.removeEventListener('keydown', handleEscKey);
        };
    }, []);

    //callback function to get the selected user
    const onUserTap = (user) => {
        console.log(user);
        setSelectedUser(user);
        setSelectedGroup(null);
        setSelectedBlockUser(null);
    }
    //callback function to get the selected group
    const onGroupTap = (group) => {
        console.log(group);
        setSelectedUser(null);
        setSelectedGroup(group);
        setSelectedBlockUser(null);
    }

    //callback function to get the selected blocked user
    const onUserBlockTap = (user) => {
        console.log(user);
        setSelectedUser(null);
        setSelectedGroup(null);
        setSelectedBlockUser(user);
    }

    const handleReleaseBlock = async (user) => {
        console.log(user);
        const body = {
            blockedUserId: user._id,
            action: 'remove'
        };
        const resp = await axios.put(`http://localhost:3000/users/block/${loginUser._id}`, body);
        loginUser.blockedUsers = loginUser.blockedUsers.filter(blockedUser => blockedUser !== user._id);
        console.log(resp.data);

        alert(`${user.username} is unblocked`);
        setSelectedBlockUser(null);
    }

    const handleBlockUser = async (user) => {
        console.log(user);
        const body = {
            blockedUserId: user._id,
            action: 'add'
        };
        const resp = await axios.put(`http://localhost:3000/users/block/${loginUser._id}`, body);
        loginUser.blockedUsers.push(user._id);
        console.log(resp.data);

        alert(`${user.username} is blocked`);
        setSelectedUser(null);
    }


    const handleSaveGroup = async (group, groupName, selectedUsers) => {
        const body = {
            name: groupName,
            adminId: loginUser._id,
            members: selectedUsers.map(user => user._id)
        };
        const { data } = await axios.put(`http://localhost:3000/groups/dynamic/${group._id}`, body);
        console.log(data.group);
        setGroups(groups.map(g => g._id === group._id ? data.group : g));
        setSelectedGroup(null);
    }

    const handleExitGroup = async (group) => {
        const body = {
            members: [sessionStorage.getItem('id')],
            deleteMembers: true
        };
        const { data } = await axios.put(`http://localhost:3000/groups/${group._id}`, body);
        console.log(data.group);
        setGroups(groups.filter(g => g._id !== group._id));
        setSelectedGroup(null);
    }

    if (selectedUser) {
        content = <ChatUserComp user={selectedUser} onBlockUser={handleBlockUser} />;
    } else if (selectedGroup) {
        content = <ChatGroupComp users={users} group={selectedGroup} onUpdateGroup={handleSaveGroup} onExitGroup={handleExitGroup} />;
    } else if (selectedBlockUser) {
        content = <UnblockComp user={selectedBlockUser} onReleaseBlock={handleReleaseBlock} />;

    } else {
        content = <h1>Please pick a user or group</h1>;
    }

    return (
        <div className="home-page">
            <header className="header">
                <div className="header-content">
                    <div>
                        <h1>Welcome {sessionStorage.getItem('username')}</h1>
                        <h3>Koby FullStack Final Project 2</h3>
                    </div>
                    <RefreshButton marginRight='30px' />
                </div>
            </header>
            <div className="main-content">
                <div className="sidebar">
                    <SideBarComp
                        loginUser={loginUser}
                        users={users}
                        groups={groups}
                        onUserTap={onUserTap}
                        onGroupTap={onGroupTap}
                        onUserBlockTap={onUserBlockTap}
                        onAddNewGroup={(newGroup) => setGroups([...groups, newGroup])}
                    />
                </div>
                <div className="content">
                    {content}
                </div>
            </div>
        </div>
    );
}

export default HomePageComp;
