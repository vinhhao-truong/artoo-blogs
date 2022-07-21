import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectMyBlogs } from '../store/user/myBlogs-slice';
import { useParams, useLocation,  } from 'react-router-dom';

const BlogDetail = () => { 
  const myBlogs = useSelector(selectMyBlogs);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search)

  const thisBlog = myBlogs.find(blog => blog._id === queryParams.get("blogId"))
  
  return (
    <>
      {
        thisBlog ? (
          <div className="BlogDetail">
            <h2>{thisBlog.title}</h2>
            <p>{thisBlog.content}</p>
          </div>
        ) : (
          <p>No blog found :(</p>
        )
      }
    </>
  )
}

export default BlogDetail;