import React, { useState } from "react";
import styled, { css } from "styled-components";

const StyledDiv = styled.div`
  width: 100%;
  height: 60px;
  background-color: #f0f0f0;
  border: 1px dashed #dcdcdc;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  transition: 0.2s ease all;
  ${(props) =>
    props.type === "hide" &&
    css`
      opacity: 0;
      height: 10px;
      padding: 5px;
    `}
`;

function DropArea({ onDrop, status, index }) {
  const [showDrop, setShowDrop] = useState(false);

  return (
    <StyledDiv
      onDragEnter={() => setShowDrop(true)}
      onDragLeave={() => setShowDrop(false)}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(status, index);
        setShowDrop(false);
      }}
      onDragOver={(e) => e.preventDefault()}
      type={showDrop ? "" : "hide"}
    >
      Drop Here
    </StyledDiv>
  );
}

export default DropArea;
