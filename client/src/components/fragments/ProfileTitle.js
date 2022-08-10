import { Link } from "react-router-dom";

export default function ProfileTitle({ imgSrc, displayedName, color, uid }) {


  return (
    <div className="ProfileTitle">
      <Link className="img" to={`/profile/${uid}`}><img src={imgSrc} alt={`img-${displayedName}`} /></Link>
      
      <Link className="name" to={`/profile/${uid}`} style={{color: color}} >{displayedName}</Link>
    </div>
  );
}
