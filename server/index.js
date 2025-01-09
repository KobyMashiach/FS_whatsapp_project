const express = require('express');
const cors = require('cors');
const expressWs = require('express-ws');
const connectDB = require('./configs/db')

const authRouter = require("./controllers/authController")
const usersRouter = require("./controllers/usersController")
const messagesRouter = require("./controllers/messagesController")
const groupsRouter = require("./controllers/groupsController")

const groupsService = require('./services/groupsService')

const app = express();
const PORT = 3000;

expressWs(app);

connectDB();
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);
app.use('/groups', groupsRouter);

const clients = {};

app.ws('/', (ws, req) => {
    let clientId;

    ws.on('message', async (msg) => {
        try {
            const data = JSON.parse(msg);
            if (data.type === 'setId') {
                clientId = data.senderId;
                clients[clientId] = ws;
                console.log(`WebSocket connection accepted: ${clientId}`);
            }
            else if (data.type === 'typing') {
                senderId = data.senderId;
                receiverId = data.receiverId;
                Object.keys(clients).forEach(id => {
                    if (id === receiverId) {
                        clients[receiverId].send(JSON.stringify({ senderId: data.senderId, content: 'Typing...' }));
                    }
                });
            } else if (data.type === 'groupMessage') {
                const groupId = data.receiverId;
                const group = await groupsService.getGroupById(groupId);
                if (group && group.members) {
                    group.members.forEach(memberId => {
                        if (clients[memberId]) {
                            try {
                                clients[memberId].send(JSON.stringify(data));
                                console.log(`Sent to: ${memberId}`);
                            } catch (error) {
                                console.error(`Error sending to client ${memberId}:`, error);
                            }
                        }
                    });
                } else {
                    console.error(`Group not found: ${groupId}`);
                }
            }
            else {
                clientId = data.senderId;
                receiverId = data.receiverId;
                console.log(`Received Message from ${data.senderId}: ${data.content}`);
                clients[clientId].send(JSON.stringify(data));
                Object.keys(clients).forEach(id => {
                    if (id === receiverId) {
                        clients[receiverId].send(JSON.stringify(data));
                    }
                });
            }
        } catch (err) {
            console.error('Error parsing message:', err);
        }
    });

    ws.on('close', (code, reason) => {
        console.log(`WebSocket connection closed: ${clientId} - ${reason}`);
        if (clientId) delete clients[clientId];
    });
});


app.listen(PORT, () => {
    console.log(`app is listening at http://localhost:${PORT}`);
});
