import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import { SenderMessageComp, ReceivedMessageComp } from './messages_display';
import CreateGroupDialog from '../../../widgets/create_group_dialog';
import ConfirmationDialog from '../../../widgets/confirmation_dialog';


function ChatGroupComp({ users, group, onUpdateGroup, onExitGroup }) {
    const [message, setMessage] = useState('');
    const [ws, setWs] = useState(null);
    const bottomRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const [showDialog, setShowDialog] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);

    //websocket connection
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3000');
        setWs(socket);

        socket.onopen = () => {
            const senderId = sessionStorage.getItem('id');
            if (senderId) {
                socket.send(JSON.stringify({
                    type: 'setId',
                    senderId: sessionStorage.getItem('id'),
                    receiverId: group._id,
                }));
            }
        };

        socket.onmessage = (event) => {
            // console.log(event.data);
            const jsonData = JSON.parse(event.data);
            if (jsonData.receiverId === group._id) {
                if (jsonData.content === 'Typing...' && !isTyping) {
                    setIsTyping(true);
                    setTimeout(() => {
                        setIsTyping(false);
                    }, 2000);
                }
                else {
                    setMessages((prevMessages) => [...prevMessages, event.data]);
                }
            }
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            socket.close();
        };
    }, [group]);

    // Scroll to the bottom when messages change
    useEffect(() => {
        const scrollDown = () => {
            const scrollContainer = bottomRef.current?.parentElement;

            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight - scrollContainer.offsetHeight
            }
        }

        scrollDown();
    }, [messages, group]);

    // Get all messages from the server
    useEffect(() => {
        const getAllMessages = async () => {
            const receiverId = group._id;
            const { data } = await axios.get(`http://localhost:3000/messages/reciver/${receiverId}`);
            const sortedMessages = data
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                .map((message) => JSON.stringify(message));

            console.log(sortedMessages);
            setMessages(sortedMessages);
        }
        getAllMessages();
    }, [group]);


    const handleSend = () => {
        const groupId = group._id;

        if (message) {
            axios.post('http://localhost:3000/messages', {
                senderId: sessionStorage.getItem('id'),
                receiverId: groupId,
                content: message,
            });
            if (ws) {
                ws.send(JSON.stringify({
                    type: 'groupMessage',
                    senderId: sessionStorage.getItem('id'),
                    receiverId: groupId,
                    content: message,
                }));
            }
            setMessage('');
        }
    }

    const handleUpdateGroup = (groupName, selectedUsers) => {
        setShowDialog(false);
        onUpdateGroup(group, groupName, selectedUsers);
    }
    return (
        <>
            <h2>{group.name}</h2>
            <hr style={{ border: '1px solid black' }} />


            {/* Messages display */}
            <div style={{ height: '60vh', display: 'block', position: 'fixed', top: 200, left: 'auto', right: 0, overflowY: 'auto', width: 'calc(100% - 300px)', padding: '10px' }}>

                {messages.map((msg) => {
                    const data = JSON.parse(msg);
                    const uniqueKey = data.messageId || data.timestamp;
                    if (data.senderId === sessionStorage.getItem('id')) {
                        return (
                            <div key={uniqueKey}>
                                <SenderMessageComp message={data.content} />
                                <br /><br /><br />
                            </div>
                        );
                    } else {
                        return (
                            <div key={uniqueKey}>
                                {users.map(user => {
                                    if (user._id === data.senderId) return <>{user.username} <br /></>
                                })
                                }
                                <ReceivedMessageComp message={data.content} />
                                <br /><br /><br />
                            </div>
                        );
                    }
                })}

                <div ref={bottomRef} />

            </div>

            {isTyping && <div style={{ position: 'absolute', left: 300, bottom: 62 }}>Typing...</div>}

            {/* Input section */}
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 290,
                    width: 'calc(100% - 310px)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px',
                    boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.3)',
                }}
            >
                <button style={{ backgroundColor: "red" }} onClick={() => setShowExitDialog(true)}>Exit Group</button>&nbsp;&nbsp;
                {group.adminId === sessionStorage.getItem('id') && <>
                    <button onClick={() => setShowDialog(true)}>Edit Group</button>&nbsp;&nbsp;
                </>
                }
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => { setMessage(e.target.value); ws.send(JSON.stringify({ type: 'typing', senderId: sessionStorage.getItem('id'), receiverId: group._id })) }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleSend();
                            }
                        }}
                        placeholder="Type a message..."
                        style={{
                            flex: 1,
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            marginRight: '10px',
                        }}
                    />
                    <button
                        onClick={handleSend}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#00af35',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
            {showDialog && <CreateGroupDialog
                users={users.filter(user => user._id !== sessionStorage.getItem('id'))}
                oldGroupName={group.name}
                oldSelectedUsers={users.filter(user => group.members.includes(user._id))}
                onSave={(groupName, selectedUsers) => handleUpdateGroup(groupName, selectedUsers)}
                onCancel={() => setShowDialog(false)}
            />}
            {showExitDialog && <ConfirmationDialog
                message={`Are you sure you want to exit from group?`}
                onYes={() => onExitGroup(group)}
                onNo={() => setShowExitDialog(false)} />

            }
        </>
    );
}

export default ChatGroupComp;
