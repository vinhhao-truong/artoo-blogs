import React from "react";

import Blog from "./Blog";

const BlogList = ({ blogs }) => {
  return (
    <div className="BlogList">
      {blogs.map((blog) => (
        <Blog
          key={blog._id}
          blog={blog}
        />
      ))}
    </div>
  )
};

export default BlogList;
