export default function ProfileTitle({ imgSrc, displayedName }) {
  return (
    <div className="ProfileTitle pickedColor">
      <img src={imgSrc} alt={`img-${displayedName}`} />
      <p>{displayedName}</p>
    </div>
  );
}
