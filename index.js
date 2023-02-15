import express from 'express';
import httpServer from 'http';
import { Server } from 'socket.io';
import { WebSocketServer } from 'ws';

const app = express();
const server = new WebSocketServer({port: 3000});

// const io = new Server(server, {
//     cors: {
//         origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
//         credentials: true
//     }
// });

app.use('/', (req, res) => {
    res.send('Holaa')
})

// io.on('connection', (socket) => {
//     const count = io.engine.clientsCount;
//     console.log(socket.id, ' connected', count);
// });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor Corriendo en el puerto ${PORT}`);
});