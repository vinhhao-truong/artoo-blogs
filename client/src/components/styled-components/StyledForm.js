import { useSelector } from "react-redux";
import { selectMyProfile } from "../store/user/myProfile-slice";
import styled from "styled-components";

const Form = styled.form`
  h1 {
    color: ${(props) => (props.pickedColor ? props.pickedColor : "#3aafa9")};
  }
  .submit-btn {
    background-color: ${(props) =>
      props.pickedColor ? props.pickedColor : "#3aafa9"};
    color: #f8f9fa;
  }
`;

const StyledForm = (props) => {
  const myProfile = useSelector(selectMyProfile);
  const classes = props.className ? props.className : ""

  return <Form onSubmit={props.onSubmit} className={"StyledForm " + classes} pickedColor={myProfile.pickedColor}>{props.children}</Form>;
};

export default StyledForm;
