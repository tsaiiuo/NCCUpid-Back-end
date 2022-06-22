const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const path = require("path");
const app = express();
const socket = require("socket.io");
require("dotenv").config();
const schedule = require("node-schedule");
const { createMatch, newMatch } = require("./controllers/matchController");
const { patch } = require("./routes/auth");
app.use(cors());
app.use(express.json());
const MONGO_URL =
  "mongodb+srv://iantsai:%40Tsaiminhuan1@nccupid.rwra2ie.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/chat", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV) {
  app.use(express.static("public/public"));
}

const server = app.listen(process.env.PORT || 5000, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

const scheduleCronstyle = () => {
  schedule.scheduleJob("40 * * * * *", async () => {
    // newMatch({ userID: "6294c111e1bd8e35be2ddbd4" });
    // createMatch({ userID: "629b461fc0eb1500b209c59c" });
    // console.log("123");
  });
};

scheduleCronstyle();
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
