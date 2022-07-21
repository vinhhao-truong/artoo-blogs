const usersRouter = require("express").Router();
const { UserModel } = require("../models/User");

const returnedData = (msg, data) => ({ message: msg, data: data });

usersRouter
  .route("/")
  .get((req, res) => {
    UserModel.find((err, foundUsers) => {
      if (!err) {
        res.send(returnedData("All users are found!", foundUsers));
      } else {
        res.send(err);
      }
    });
  })
  .post(async (req, res) => {
    try {
      //Create New User
      if (req.body.newUser) {
        const newUser = new UserModel(req.body.newUser);
        newUser.save();
        console.log(req.body.user);
        res.send("New User Created!");
      }
    } catch (err) {
      console.log(err);
    }
  });

usersRouter.route("/:uid").get((req, res) => {
  const userId = req.params.uid;
  UserModel.findOne({ _id: userId }, (findErr, foundData) => {
    if (!findErr) {
      res.send(returnedData(`${foundData.firstName} is found!`, foundData));
    } else {
      res.send(findErr);
    }
  });
});

module.exports = usersRouter