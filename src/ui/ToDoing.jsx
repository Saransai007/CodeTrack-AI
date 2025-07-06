import styled from "styled-components";
import AddTo from "./AddTo";
import Card from "./Card";
import DropArea from "./DropArea";
import React from "react";
import { useToggle } from "../ToggleContext";
const StyledDiv = styled.div`
  background-color: ${(props) =>
    props.$toggle
      ? "#1f2937"
      : "var(--color-grey-100)"}; /* dark bg / light bg */
  border-radius: 1.6rem;
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: ${(props) =>
    props.$toggle
      ? "0 2px 6px rgba(0, 0, 0, 0.8)" // stronger shadow in dark mode
      : "0 2px 6px rgba(0, 0, 0, 0.04)"}; // light shadow in light mode
  border: 1px solid ${(props) => (props.$toggle ? "#374151" : "#e5e7eb")}; /* dark border / light border */
  color: ${(props) => (props.$toggle ? "#e5e7eb" : "#111827")}; /* text color */
`;

const CardContainer = styled.div`
  overflow-y: auto;
  flex: 1;
  margin-top: 1.2rem;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  overflow-x: hidden;
`;

const StyledHeading = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${(props) => (props.$toggle ? "#e5e7eb" : "#1f2937")};
`;

function ToDoing({
  headings,
  data,
  onAddTask,
  setActiveCard,
  status,
  onDrop,
  descAdd,
}) {
  const { toggle } = useToggle();
  return (
    <StyledDiv $toggle={toggle}>
      <StyledHeading $toggle={toggle}>{headings}</StyledHeading>
      {onAddTask && <AddTo onAdd={onAddTask} />}
      <CardContainer>
        <DropArea status={status} index={0} onDrop={onDrop} />
        {data.map((item, index) => (
          <React.Fragment key={item.id}>
            <Card
              id={item.id}
              title={item.title}
              description={item.description}
              urgent={item.urgent}
              setActiveCard={setActiveCard}
              descAdd={descAdd}
            />
            <DropArea status={status} index={index + 1} onDrop={onDrop} />
          </React.Fragment>
        ))}
      </CardContainer>
    </StyledDiv>
  );
}

export default ToDoing;
