import express from 'express';
import httpServer from 'http';
import { Server } from 'socket.io';

const app = express();
const server = httpServer.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://127.0.0.1:5173"],
        credentials: true
    }
});

app.use('/', (req, res) => {
    return res.json({status: 'Ok'})
});

io.on('connection', (socket) => {
    console.log('Alguien se ha conectado...', socket.id);
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor Corriendo en el puerto ${PORT}`);
});