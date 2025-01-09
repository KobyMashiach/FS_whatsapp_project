import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import { SenderMessageComp, ReceivedMessageComp } from './messages_display';
import ConfirmationDialog from '../../../widgets/confirmation_dialog';
import RefreshButton from '../../../widgets/refresh_button';


function ChatUserComp({ user, onBlockUser }) {
    const [message, setMessage] = useState('');
    const [ws, setWs] = useState(null);
    const bottomRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const [showDialog, setShowDialog] = useState(false);

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
                    receiverId: user._id,
                }));
            }
        };

        socket.onmessage = (event) => {
            console.log(event.data);
            const jsonData = JSON.parse(event.data);
            if ((jsonData.senderId === sessionStorage.getItem('id') || jsonData.senderId === user._id) && (jsonData.receiverId === sessionStorage.getItem('id') || jsonData.receiverId === user._id)) {
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
    }, [user]);

    // Scroll to the bottom when messages change
    useEffect(() => {
        const scrollDown = () => {
            const scrollContainer = bottomRef.current?.parentElement;

            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight - scrollContainer.offsetHeight
            }
        }

        scrollDown();
    }, [messages, user]);

    // Get all messages from the server
    useEffect(() => {
        const getAllMessages = async () => {
            const senderId = sessionStorage.getItem('id');
            const receiverId = user._id;

            const body = {
                senderId, receiverId
            };

            const { data } = await axios.post('http://localhost:3000/messages/history', body);

            const sortedMessages = data
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                .map((message) => JSON.stringify(message));

            console.log(sortedMessages);
            //todo: FIX THIS
            setMessages(sortedMessages);
        }
        getAllMessages();
    }, [user]);


    const handleSend = () => {
        const userId = user._id;

        if (message) {
            console.log(`Message sent: ${message}`);
            console.log(`From user: ${sessionStorage.getItem('id')}`);
            console.log(`To user: ${userId}`);
            axios.post('http://localhost:3000/messages', {
                senderId: sessionStorage.getItem('id'),
                receiverId: userId,
                content: message,
            });
            if (ws) {
                ws.send(JSON.stringify({
                    senderId: sessionStorage.getItem('id'),
                    receiverId: userId,
                    content: message,
                }));
            }
            setMessage('');

        }
    }


    return (
        <>
            {user.blockedUsers && user.blockedUsers.includes(sessionStorage.getItem('id')) ? (
                <div style={{ textAlign: 'center' }}>
                    <h1>{user.username} blocked you</h1>
                    <RefreshButton />
                </div>


            ) : (
                <>
                    <h2>{user.username}</h2>
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
                        <button onClick={() => setShowDialog(true)}>Block User</button>&nbsp;&nbsp;

                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => { setMessage(e.target.value); ws.send(JSON.stringify({ type: 'typing', senderId: sessionStorage.getItem('id'), receiverId: user._id })) }}
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
                    {showDialog && <ConfirmationDialog
                        message={`Are you sure you want to block ${user.username}?`}
                        onYes={() => onBlockUser(user)}
                        onNo={() => setShowDialog(false)}

                    />}
                </>
            )}


        </>
    );
}

export default ChatUserComp;
