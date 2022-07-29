const usersRouter = require("express").Router();

const handleFind = require("../controller/handleFind");

const { UserModel } = require("../models/User");
const { BlogModel } = require("../models/Blog");

const returnedData = (msg, data) => ({ message: msg, data: data });

usersRouter
  .route("/")
  .get((req, res) => {
    handleFind("All users are found!", res, UserModel, "find");
  })
  .post(async (req, res) => {
    try {
      //Create New User
      if (req.body.newUser) {
        const newUser = new UserModel(req.body.newUser);
        newUser.save();
        res.send(returnedData("New User Created!", null));
      }
    } catch (err) {
      console.log(err);
    }
  }).patch((req, res) => {
    try {
      if(req.body) {
        const newProfile = req.body.newProfile;
        UserModel.findByIdAndUpdate(newProfile._id, {
          $set: newProfile
        }, {
          overwrite: true
        }, (queryErr) => {
          if(!queryErr) {
            res.send(returnedData("Profile Updated!"))
          } else {
            console.log(queryErr)
          }
        })
      }
      console.log("Profile updated of error (if have above)")
    } catch(err) {
      console.log(err)
    }
  });

usersRouter.route("/:uid").get((req, res) => {
  const userId = req.params.uid;
  const query = req.query.q;

  if (query) {
    switch (query) {
      case "myBlogs":
        handleFind(
          "Blog list is found!",
          res,
          BlogModel,
          "find",
          {owner: userId}
        );
        break;
      case "pickedColor":
        handleFind(
          "User's picked color is found",
          res,
          UserModel,
          "findById",
          userId,
          "pickedColor"
        );
        break;
      default:
    }
  }

  if (!query) {
    handleFind("User is found!", res, UserModel, "findOne", { _id: userId });
  }
});

module.exports = usersRouter;
