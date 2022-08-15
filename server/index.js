const express = require("express");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

//import routers
const userRouter = require(`${__dirname}/routers/users`);
const blogRouter = require(`${__dirname}/routers/blogs`);

//import fns
// const getUrl = require(`${__dirname}/fns/getURLPath`)

const app = express();

app.use(express.json());
app.use(cors());
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build/")));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
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

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("send_msg", (msg) => {
    console.log(msg);
  });
});

httpServer.listen(3001, () => {
  console.log("Server on 3001");
  console.log();
});