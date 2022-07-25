import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ReactLoading from 'react-loading';

const BlogDetail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const thisBlogId = queryParams.get("blogId");

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const blankBlog = {
    _id: "",
    title: "",
    owner: "",
    content: "",
    category: "",
    reactions: [],
    comments: [],
  };

  const [thisBlog, setThisBlog] = useState({ ...blankBlog });

  const callBlog = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:3001/blogs/${thisBlogId}`);
      const blogData = await res.data.data;
      console.log(blogData)
      setThisBlog({ ...blogData });
    } catch(err) {
      setError(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    callBlog();
  }, []);

  return (
    <div className="BlogDetail">
      {/* {thisBlog ? (
        <div className="BlogDetail">
          <h2>{thisBlog.title}</h2>
          <p>{thisBlog.content}</p>
        </div>
      ) : (
        <p>No blog found!</p>
      )} */}
      {isLoading}
    </div>    
  );
};

export default BlogDetail;
