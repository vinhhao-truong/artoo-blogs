const axios = require("axios");
const path = require("path");

const response = require(path.join(__dirname, "../../fns/response"));
const getFirebaseURL = require(path.join(__dirname, "../../fns/getFirebaseURL"));

const { UserModel } = require(path.join(__dirname, "../../models/User"));

const updateProfile = async (newProfile, res) => {
  try {
    await axios.post(
      getFirebaseURL(
        "https://identitytoolkit.googleapis.com/v1/accounts:update"
      ),
      {
        idToken: newProfile.idToken,
        displayName: newProfile.nickname
          ? newProfile.nickname
          : newProfile.firstName
      }
    );
    UserModel.findByIdAndUpdate(
      newProfile._id,
      {
        $set: newProfile,
      },
      {
        overwrite: true,
      },
      (queryErr) => {
        if (!queryErr) {
          res.send(response("Profile Updated!"));
        } else {
          console.log(queryErr);
        }
      }
    );
  } catch(err) {
    console.log(err.response);
  }
}

module.exports = updateProfile;