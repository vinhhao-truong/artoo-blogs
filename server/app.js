const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

//import routers
const userRouter = require("./routers/users");
const blogRouter = require("./routers/blogs");

const app = express();

app.use(express.json());
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

mongoose.connect(
  "mongodb+srv://artoo_admin:h02468975310h@cluster0.67krx.mongodb.net/artooDB",
  {
    useNewUrlParser: true,
  }
);

app.use("/users", userRouter);
app.use("/blogs", blogRouter);

io.on("connection", (socket) => {
  socket.on("msg", data => {
    console.log(data)
  })
});

io.on("send_msg", (name) => {
  console.log(name)
  io.on("msg", (data) => {
    console.log(data);
  });
});



httpServer.listen(3001, () => {
  console.log("Server on 3001");
  console.log()
});
