import express from 'express';
import {createServer} from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer();

const io = new Server();
io.attach(server);

app.use('/', (req, res) => {
    return res.json({status: 'Ok'})
});

io.on("connection", (socket) => {
    console.log('Conectado...');
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor Corriendo en el puerto ${PORT}`);
});