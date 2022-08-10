import React from "react";
import styled from "styled-components";
import useAuthColor from "../../hooks/useAuthColor";

const Styled = styled.div`

  .pickedColor {
    color: ${(props) => (props.pickedColor ? props.pickedColor : "#3aafa9")};
  }
  .pickedColor-hover {
    color: ${(props) => (props.pickedColor ? props.pickedColor : "#3aafa9")};
    &:hover {
      filter: brightness(80%);
    }
  }
  .pickedColor-hoverOnly {
    color: black;
    &:hover {
      color: ${(props) => (props.pickedColor ? props.pickedColor : "#3aafa9")};
    }
  }
  .pickedColorBg {
    background-color: ${(props) =>
      props.pickedColor ? props.pickedColor : "#3aafa9"};
    color: #f8f9fa;
  }
  .pickedColorBg-hover {
    background-color: ${(props) =>
      props.pickedColor ? props.pickedColor : "#3aafa9"};
    color: #f8f9fa;
    &:hover {
      background-color: ${(props) =>
        props.pickedColor ? props.pickedColor : "#3aafa9"};
      filter: brightness(80%);
    }
  }
`;

const StyledApp = (props) => {
  const pickedColor = useAuthColor();

  return (
    <>
      <Styled pickedColor={pickedColor}>{props.children}</Styled>
    </>
  );
};

export default StyledApp;
