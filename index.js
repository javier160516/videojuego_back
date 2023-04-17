import express from "express";
import httpServer from "http";
import { Server } from "socket.io";
import db from "./src/config/db.js";
import cors from "cors";
import gameRoutes from "./src/routes/gameRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import ngrok from "ngrok";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Conexion a la base de datos
// try {
//   await db.authenticate();
//   db.sync();
// } catch (error) {
//   console.log(error);
// }
const server = httpServer.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  },
});

//Carpeta publica
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// app.use("/", gameRoutes);
// app.use(express.static("/public/uploads"));
// app.get("/public/uploads/:img", (req, res) => {
//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);
//   res.sendFile(`${__dirname}/public/uploads/${req.params.img}`);
// });

io.on("connection", (socket) => {
  let aliases = [];
  let usersInRoom = [];
  console.log(`Usuario ${socket.id} conectado`);
  const usersActive = socket.client.conn.server.clientsCount;
  // mandar token...
  socket.on("join", async (room) => {
    console.log(`Socket ${socket.id} joining ${room}`);
    socket.join(room);
    console.log(io.sockets.adapter.rooms, " desde rooms");
    // console.log(io.sockets, ' desde rooms');
    // console.log(, ' desde rooms');
    await (
      await io.in(room).allSockets()
    ).forEach((user) => {
      usersInRoom.push(user);
    });

    socket.on("aliases", ({ alias }) => {
      console.log(`El usuario ${alias} está conectado a la sala ${room}`);
      aliases.push(alias);

      io.to(room).emit("connectedInRoom", {
        message: `El usuario ${alias} está conectado a la sala ${room}`,
        data: usersInRoom.length,
      });
    });
    // socket.data.username = user.alias;
    // const users = [];

    // for (let [id, socket] of io.of('/').sockets) {
    //     users.push({
    //         userID: id,
    //         username: socket.data['username'] !== undefined ? socket.data.username : `Usuario invitado ${id}`
    //     });
    // }
    // socket.emit('connectedInRoom', users);
    // socket.emit('message', 'Esperando Jugador...');

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

  socket.on("disconnect", () => {
    console.log(`Usuario ${socket.id} desconectado`);
    socket.emit("disconnected", { status: false });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor Corriendo en el puerto ${PORT}`);
});

ngrok.connect(
  {
    proto: "http",
    addr: PORT,
  },
  (err, url) => {
    if (err) {
      console.log("Error mientras conectamos ngrok ", err);
      return new Error("Ngrok Failed");
    }
  }
);
