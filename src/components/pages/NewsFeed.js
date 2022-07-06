import React, {useState} from "react";

import NewPostBtn from '../fragments/NewPostBtn';
import NewPostModal from "../modals/NewPostModal";

const NewsFeed = () => {
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  return (
    <div className="NewsFeed">  
      <p>newfeeds</p>
      <NewPostBtn onOpenModal={() => {setIsNewPostModalOpen(true)}} />
      <NewPostModal isOpen={isNewPostModalOpen} onClose={() => {setIsNewPostModalOpen(false)}} />
    </div>
  );
};

export default NewsFeed;
