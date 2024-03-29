import { Link } from "react-router-dom";

import bgImg from "../img/landingBg.jpg";

import Login from "./Login";
import { BiCopyright } from "react-icons/bi";
import { MainHelmet } from "../components/fragments/Helmet";

const Landing = () => {
  return (
    <div className="Landing">
      <MainHelmet />

        <img src={bgImg} alt="bg" />

      <h1>
        <span className="pickedColor">Artoo Blogs</span>, where you share your
        masterpieces
        <br />
        to other Artists.
      </h1>
      <div className="Landing__links">
        <Link to="/signup">
          <button className="pickedColorBg-hover">
            No Account? Sign Up Now!
          </button>
        </Link>
      </div>
      <Login />
      <div className="footer">
        <BiCopyright /> Created by Arnold Truong with love.
      </div>
    </div>
  );
};

export default Landing;
