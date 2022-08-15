import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import bg from "../img/notFoundBg.jpg";
import { selectMyProfile } from "../store/user/myProfile-slice";

const NotFound = () => {
  const navigate = useNavigate()
  const myProfile = useSelector(selectMyProfile)

  const handleBack = (e) => {
    e.preventDefault();
    navigate("/");
  }

  return (
    <div className="NotFound">
      <img src={bg} alt="Not found bg" className="NotFound__bg" />
      <h1>404 Page Not Found :(</h1>
      <button style={{
        backgroundColor: myProfile.pickedColor ? myProfile.pickedColor : "#3aafa9"
      }} onClick={handleBack} >Back to Home</button>
    </div>
  )
}

export default NotFound;