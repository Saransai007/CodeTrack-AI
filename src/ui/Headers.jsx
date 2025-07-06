import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.div`
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-bottom: 1px solid #ddd;
`;

const Controls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: coral;
  color: white;
  border: none;
  border-radius: 4px;
`;

function Headers() {
  return (
    <HeaderContainer>
      <h2>Calendar</h2>
      <Controls>
        <button>◀</button>
        <button>▶</button>
        <Button>+ Add Event</Button>
      </Controls>
    </HeaderContainer>
  );
}

export default Headers;
