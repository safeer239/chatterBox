const express = require("express");
const { chats } = require("./data/data");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const { connectDB } = require("./config/db");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
const { errorHandler, notFound } = require("./utils/errorHandler");
const path = require("path");

app.use(cors());
dotenv.config();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is available");
});

app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

const _dirname=path.resolve()

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(_dirname,"/frontend/dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname,"/frontend/dist/index.html"))
  })
}

app.use(errorHandler);
app.use(notFound);

const PORT = process.env.PORT || 5000;

connectDB();
const server = app.listen(PORT, console.log("server listening on port 5000"));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room: " +room);
  });

  socket.on("typing",(room)=>socket.in(room).emit("typing"));
  socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"))

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users is not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message received", newMessageRecieved)
    });
  });

  socket.off("setup",()=>{
    console.log("User disconnected")
    socket.leave(user._id)
  })
});
