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

let usersInfo = [];
let roomActual = '';
io.on("connection", (socket) => {
  let aliases = [];
  let usersInRoom = [];
  console.log(`Usuario ${socket.id} conectado`);

  // mandar token...
  if(usersInfo.length > 2){

    socket.on("join", async (room) => {
      console.log(`Socket ${socket.id} joining ${room}`);
      socket.join(room);
      roomActual = room;
  
      // SE ENVIA EL ID AL FRONTEND
      socket.broadcast.to(socket.id).emit('getId', socket.id);
  
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
  
        // usersInfo.push({id: socket.id, name: alias});
        sendUsers({ id: socket.id, name: alias });
        // console.log(usersInfo, ' desde usersInfo')
      });
    });
  }

  const sendUsers = (data) => {
    usersInfo.push(data);
    console.log(usersInfo, " desde sendUsers");
    // if(usersInfo.length <= 2){
      io.in(roomActual).emit("aliasesPlayers", usersInfo);
    // }
  };

  const filterUsers = (id) => {
    const newUsersInfo = usersInfo.filter((user) => user.id != id);
    console.log(newUsersInfo, " desde filterUsers");
    usersInRoom = newUsersInfo;
  };

  socket.on("disconnect", () => {
    console.log(`Usuario ${socket.id} desconectado`);
    filterUsers(socket.id);
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
