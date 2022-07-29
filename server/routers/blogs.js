const blogRouter = require("express").Router();
const handleFind = require("../controller/handleFind");
const { BlogModel } = require("../models/Blog");

const returnedData = (msg, data) => ({ message: msg, data: data });

const logErrQuery = (err) => {
  if (err) {
    console.log(err);
  }
};

blogRouter
  .route("/")
  .get((req, res) => {
    
      handleFind("All blogs found successfully!", res, BlogModel, "find");
      console.log("All blogs found or error occurred (if have above)!");
    

    
  })
  .post((req, res) => {
    try {
      if (req.body.newBlog) {
        const newBlog = new BlogModel(req.body.newBlog);
        //Save to overall blogs db
        newBlog.save((queryErr) => {
          if (!queryErr) {
            res.send(returnedData("The blog created successfully!", null));
            console.log("The new blog saved successfully!");
          } else {
            console.log(queryErr);
          }
        });
      }
    } catch (err) {
      res.send(err);
    }
  })
  .delete((req, res) => {
    try {
      //delete from the blogs collections
      BlogModel.deleteOne({ _id: req.body._id }, (queryErr) => {
        if (!queryErr) {
          res.send(
            returnedData("The blog has been deleted from the database!", null)
          );
        } else {
          res.send(queryErr);
        }
      });
    } catch (err) {
      console.log(err);
    }
    console.log("The blog is delete or error occurred (if have above)!");
  })
  .patch((req, res) => {
    try {
      BlogModel.updateOne(
        { _id: req.body.updatedBlog._id },
        {
          $set: req.body.updatedBlog,
        },
        logErrQuery
      );
      res.send(returnedData("The post updated!", null));
      console.log("The blog is updated or error occurred (if have above)!");
    } catch (err) {
      console.log(err);
    }
  });

blogRouter.route("/filter/:resData").get((req, res) => {
  const resData = req.params.resData;
  const query = req.query;

  if(resData) {
    if(resData === "allArtTypes") {
      try {
        let typeList = [];
        BlogModel.find((findErr, foundBlogs) => {
          if (!findErr) {
            typeList = foundBlogs.map((blog) => blog.artType);
            const filteredTypeList = [];
            for (let type of typeList) {
              if (!filteredTypeList.includes(type) && type.length !== 0) {
                filteredTypeList.push(type);
              }
            }
            res.send(returnedData("Type list found!", [...filteredTypeList]));
          } else {
            console.log(findErr);
          }
        });
      } catch (err) {
        console.log(err);
      }
    }

    if(resData === "blogList") {
      if (query) {
        if (query.artType) {
          handleFind("Filtered blogs found!", res, BlogModel, "find", {
            artType: query.artType,
          });
          console.log("Filtered blogs found or error occurred (if have above)!");
        }
        if (query.artTypes) {
          
        }
      }
    }
  }
})

blogRouter.route("/:blogId").get((req, res) => {
  handleFind("The blog is found!", res, BlogModel, "findOne", {
    _id: req.params.blogId,
  });
  console.log("The blog is found or error occurred (if have above)!");
});

module.exports = blogRouter;
