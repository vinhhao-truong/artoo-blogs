const blogRouter = require("express").Router();
const { BlogModel } = require("../models/Blog");

const returnedData = (msg, data) => ({ message: msg, data: data });

blogRouter
  .route("/")
  .get((req, res) => {
    BlogModel.find((err, foundBlogs) => {
      if (!err) {
        res.send(returnedData("All blogs found successfully!", foundBlogs));
      } else {
        res.send(err);
      }
    });
  })
  .post(async (req, res) => {
    try {
      if (req.body.newBlog) {
        const newBlog = new BlogModel(req.body.newBlog);
        //Save to overall blogs db
        await newBlog.save((err) => {
          if (!err) {
            console.log("The new blog saved successfully!");
          } else {
            console.log(err);
          }
        });
        //Update my blogs
        await UserModel.updateOne(
          { _id: req.body.newBlog.owner },
          {
            $push: { myBlogs: req.body.newBlog },
          },
          (err) => {
            if (!err) {
              console.log("The new blog saved successfully!");
            } else {
              console.log(err);
            }
          }
        );
      }
    } catch (err) {
      res.send(err);
    }
  });

blogRouter.route("/:blogId").get((req, res) => {
  BlogModel.findOne({ _id: req.params.blogId }, (err, foundBlogs) => {
    if (!err) {
      res.send(returnedData(`${foundBlogs.title} found successfully!`, foundBlogs));
    } else {
      res.send(err);
    }
  });
});

module.exports = blogRouter;
