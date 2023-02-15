import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
const server = createServer();
app.use(cors())
const io = new Server(server, {
    cors: {
        origin: "https://127.0.0.1:5173",
        credentials: true
      }
});
// io.attach(server, {
//     cors: {
//         origin: "https://my-frontend.com",
//         credentials: true
//       }
    // handlePreflightRequest: (req, res) => {
    //     const headers = {
    //         "Access-Control-Allow-Headers": "Content-Type, Authorization",
    //         "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
    //         "Access-Control-Allow-Credentials": true
    //     };
    //     res.writeHead(200, headers);
    //     res.end();
    // }
// });

app.use('/', (req, res) => {
    return res.json({ status: 'Ok' })
});

io.on("connection", (socket) => {
    console.log(socket);
    console.log('Conectado...');
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor Corriendo en el puerto ${PORT}`);
});