import express from 'express';
import httpServer from 'http';
import { Server } from 'socket.io';
import db from './src/config/db.js';
import cors from 'cors';
import gameRoutes from './src/routes/gameRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
//Conexion a la base de datos
try {
    await db.authenticate();
    db.sync();
} catch (error) {
    console.log(error)
}
const server = httpServer.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://127.0.0.1:5173"],
        credentials: true
    }
});

//Carpeta publica
app.use('/', gameRoutes);
app.use(express.static('/public/uploads'));
app.get('/public/uploads/:img', (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
    res.sendFile(`${__dirname}/public/uploads/${req.params.img}`);
});


io.on('connection', (socket) => {
    console.log(`Usuario ${socket.id} conectado`);
    const usersActive = socket.client.conn.server.clientsCount;
    // mandar token...
    socket.on('join', async (user) => {
        socket.join('room1');
        socket.to("room1").emit('connectedInRoom', `El usuario ${user.alias} está conectado a la sala 1`);
        socket.data.username = user.alias;
        const users = [];

        for (let [id, socket] of io.of('/').sockets) {
            users.push({
                userID: id,
                username: socket.data['username'] !== undefined ? socket.data.username : `Usuario invitado ${id}`
            });
        }
        socket.emit('connectedInRoom', users);
        socket.emit('message', 'Esperando Jugador...');

        // if (usersActive === 1) {
        //     socket.emit('waiting', { status: true, message: 'Esperando a otro jugador' });
        // } else {
        //     console.log(user, ' desde users');
        //     io.sockets.emit('waiting', { status: false, message: '' });
        //     socket.on('join', async user => {
        //         socket.user = { ...user, id: socket.client.id };
        //         const avatars = await Personaje.findAll();
        //         let newAvatars = [];
        //         avatars.forEach(avatar => {
        //             newAvatars.push(avatar)
        //         });
        //         socket.emit('select-avatar', { user: socket.user, usersActive, connection: true, avatars: newAvatars });
        //     });
        // }
    });
    // if (usersActive <= 2) {
    //     socket.on('join', async user => {
    //         socket.user = { ...user, id: socket.client.id };
    //         const avatars = await Personaje.findAll();
    //         let newAvatars = [];
    //         avatars.forEach(avatar => {
    //             newAvatars.push(avatar)
    //         });
    //         socket.emit('select-avatar', { user: socket.user, usersActive, connection: true, avatars: newAvatars });
    //     });
    // } else {
    //     socket.emit('error', { message: 'No hay más espacios' });
    //     console.log('No hay mas espacios');
    // }

    socket.on('disconnect', () => {
        console.log(`Usuario ${socket.id} desconectado`);
        socket.emit('disconnected', { status: false });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor Corriendo en el puerto ${PORT}`);
});