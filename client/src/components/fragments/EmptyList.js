import coffeeImg from "../../img/coffee.png";

const EmptyList = ({msg}) => {
  return (
    <div className="BlogList EmptyList">
      <img src={coffeeImg} alt="coffee" />
      <h1>{msg}</h1>
    </div>
  )
}

export default EmptyList;