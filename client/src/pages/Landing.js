import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="Landing">
      <h1>
        Welcome to <span className="pickedColor">Artoo</span> Blogs, where you
        post and share your <span className="pickedColor">masterpieces</span>
        <br />
        ... without{" "}
        <span style={{ textDecoration: "line-through" }}>restriction</span> to
        any kinds.
      </h1>
      <div className="Landing__links">
        <Link to="/signup">
          <button className="pickedColorBg-hover">Get Started</button>
        </Link>
        <Link className="signup-link pickedColor-hoverOnly" to="/login">
          ...or log in
        </Link>
      </div>
    </div>
  );
};

export default Landing;
