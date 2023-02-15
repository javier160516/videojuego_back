import express from 'express';
import httpServer from 'http';
import { Server } from 'socket.io';

const app = express();
const server = httpServer.createServer(app);


app.use('/', (req, res) => {
    return res.json({status: 'Ok'})
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor Corriendo en el puerto ${PORT}`);
});