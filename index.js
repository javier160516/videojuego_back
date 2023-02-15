import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
const server = createServer();
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const io = new Server(server, {
    cors: {
        origin: "https://127.0.0.1:5173",
        credentials: true
    }
});

app.use('/', (req, res) => {
    return res.json({ status: 'Ok, prueba 3' })
});

io.on("connection", (socket) => {
    console.log(socket);
    console.log('Conectado...');
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor Corriendo en el puerto ${PORT}`);
});