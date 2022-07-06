import React from "react";

import Blog from "./Blog";

const BlogList = ({ blogs, profile }) => {

  return (
    <div className="BlogList">
      {blogs.map((blog, idx) => (
        <Blog
          key={idx}
          profile={profile}
          blogTitle={blog.blogTitle}
          blogContent={blog.blogContent}
          blogId={blog.blogId}
        />
      ))}
    </div>
  )
};

export default BlogList;
