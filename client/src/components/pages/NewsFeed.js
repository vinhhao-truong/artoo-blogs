import React, {useState, useEffect, useCallback} from "react";
import axios from "axios";

import NewPostBtn from '../fragments/NewPostBtn';
import NewPostModal from "../modals/NewPostModal";
import BlogList from "../fragments/BlogList";

const NewsFeed = () => {
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newsFeedBlogs, setNewsFeedBlogs] = useState([]);

  const callNewsFeed = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3001/blogs/");
      const data = await res.data.data;
      console.log(data)
      setNewsFeedBlogs(data);
    } catch (err) {
      console.log(err);
    }
  }, [])

  useEffect(() => {
    callNewsFeed();
  }, [callNewsFeed])

  return (
    <div className="NewsFeed">  
      <BlogList blogs={newsFeedBlogs} />
      <NewPostBtn onOpenModal={() => {setIsNewPostModalOpen(true)}} />
      <NewPostModal isOpen={isNewPostModalOpen} onClose={() => {setIsNewPostModalOpen(false)}} />
    </div>
  );
};

export default NewsFeed;
