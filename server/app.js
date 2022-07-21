const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

//import models
const { BlogModel } = require("./models/Blog");
const { UserModel } = require("./models/User");

//import routers
const userRouter = require("./routers/users")
const blogRouter = require("./routers/blogs")

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/artooDB", {
  useNewUrlParser: true,
});

app.use("/users", userRouter)
app.use("/blogs", blogRouter)

app.listen(3001, () => {
  console.log("Server on 3001");
});
