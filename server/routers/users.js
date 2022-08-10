const axios = require("axios");
const path = require("path");
const usersRouter = require("express").Router();

//functions
const handleFind = require(path.join(__dirname, "../fns/handleFind"));
const response = require(path.join(__dirname, "../fns/response"));
const getFirebaseURL = require(path.join(__dirname, "../fns/getFirebaseURL"));

//models
const { UserModel } = require(path.join(__dirname, "../models/User"));
const { BlogModel } = require(path.join(__dirname, "../models/Blog"));

//controllers
const updateProfile = require(path.join(
  __dirname,
  "../controller/users/updateProfile"
));

usersRouter
  .route("/")
  .get((req, res) => {
    handleFind("All users are found!", res, UserModel, "find");
  })
  .post(async (req, res) => {
    const request = req.query.request;
    const body = req.body;
    if (request && body) {
      if (request === "signup") {
        const reqNewUser = body.newUser;
        try {
        //update displayName for firebase to handle email verification
        await axios.post(
          getFirebaseURL(
            "https://identitytoolkit.googleapis.com/v1/accounts:update"
          ),
          {
            idToken: reqNewUser.idToken,
            displayName: reqNewUser.nickname
              ? reqNewUser.nickname
              : reqNewUser.firstName,
          }
        );
        //email verification sent
        await axios.post(
          getFirebaseURL(
            "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode"
          ),
          {
            idToken: reqNewUser.idToken,
            requestType: "VERIFY_EMAIL",
          }
        );
        const newUser = new UserModel(reqNewUser);
          newUser.save();
          res.send(response("New User Created!", null));
        } catch (err) {
          console.log(err);
        }
      }
    }
  })
  .patch((req, res) => {
    const action = req.query.action;
    const body = req.body;
    if (body) {
      if (action === "updateProfile") {
        updateProfile(body.newProfile, res);
        console.log("Profile updated or error above(if exists)");
      }
    }
  });

usersRouter.route("/search").get((req, res) => {
  const query = req.query.name;
  if (query.length > 0) {
    UserModel.find((err, foundData) => {
      if (!err) {
        const resList = [];
        for (let user of foundData) {
          const userNickname = user.nickname;
          const userFirstName = user.firstName;
          const userLastName = user.lastName;
          const uid = user._id;
          const pickedColor = user.pickedColor;

          const queryLength = query.length;

          const pushInResList = () => {
            // if (!resList.includes(name)) {
            //   resList.push(name);
            // }
            if (resList.length === 0) {
              resList.push({
                nickname: userNickname,
                name: `${userFirstName} ${userLastName}`,
                uid: uid,
                color: pickedColor,
              });
            } else {
              if (resList.every((item) => item.uid !== uid)) {
                resList.push({
                  nickname: userNickname,
                  name: `${userFirstName} ${userLastName}`,
                  uid: uid,
                  color: pickedColor,
                });
              }
            }
          };

          if (userNickname.slice(0, queryLength) === query) {
            pushInResList();
          } else if (userFirstName.slice(0, queryLength) === query) {
            pushInResList();
          } else if (userLastName.slice(0, queryLength) === query) {
            pushInResList();
          }
        }
        res.send(response("User Found!", [...resList]));
      } else {
        console.log(err);
      }
    });
  } else {
    res.send(response("Blank Search!", []));
  }
});
usersRouter.route("/:uid").get((req, res) => {
  const userId = req.params.uid;
  const query = req.query.q;

  if (query) {
    switch (query) {
      case "myBlogs":
        handleFind("Blog list is found!", res, BlogModel, "find", {
          owner: userId,
        });
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
