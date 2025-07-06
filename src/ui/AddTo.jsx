import styled from "styled-components";
import { useState } from "react";
import { useToggle } from "../ToggleContext";

const StyledDiv = styled.div`
  text-align: center;
  padding: 3% 3%;
  border: 1px solid
    ${(props) =>
      props.$toggle ? "#4b5563" /* dark gray */ : "var(--color-brand-300)"};
  background-color: ${(props) =>
    props.$toggle
      ? "#374151" /* dark: bg-gray-700 */
      : "var(--color-brand-200)"};
  border-radius: 5px;
  cursor: pointer;
  font-size: 2rem;
  transition: all 0.3s ease;
  color: ${(props) => (props.$toggle ? "#d1d5db" : "inherit")};

  span {
    display: inline-block;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  &:active span {
    transform: scale(0.9);
  }
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 1.6rem;
`;

const Input = styled.input`
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) => (props.$toggle ? "#4b5563" : "var(--color-grey-300)")};
  border-radius: 5px;
  font-size: 1.4rem;
  background-color: ${(props) => (props.$toggle ? "#1f2937" : "white")};
  color: ${(props) => (props.$toggle ? "#d1d5db" : "black")};

  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.$toggle ? "#2563eb" : "var(--color-brand-500)"};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$toggle ? "rgba(37, 99, 235, 0.4)" : "rgba(59, 130, 246, 0.4)"};
  }
`;

const Select = styled.select`
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) => (props.$toggle ? "#4b5563" : "var(--color-grey-300)")};
  border-radius: 5px;
  font-size: 1.4rem;
  background-color: ${(props) => (props.$toggle ? "#1f2937" : "white")};
  color: ${(props) => (props.$toggle ? "#d1d5db" : "black")};

  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.$toggle ? "#2563eb" : "var(--color-brand-500)"};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$toggle ? "rgba(37, 99, 235, 0.4)" : "rgba(59, 130, 246, 0.4)"};
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.2rem;
  background-color: ${(props) =>
    props.$toggle ? "#2563eb" : "var(--color-brand-500)"};
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.$toggle ? "#1e40af" : "var(--color-brand-600)"};
  }
`;

const StyledSpan = styled.span`
  color: ${(props) => (props.$toggle ? "#d1d5db" : "black")};
  font-size: 1.2rem;
  margin-top: 0.5rem;
  text-align: center;
`;

function TodoForm({ onAdd }) {
  const [task, setTask] = useState("");
  const [urgency, setUrgency] = useState("0");
  const { toggle } = useToggle();

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    if (!task.trim()) return;

    onAdd({ task, urgency: parseInt(urgency) });
    setTask("");
    setUrgency("0");
  }

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <Input
        $toggle={toggle}
        type="text"
        placeholder="Enter task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <Select
        $toggle={toggle}
        value={urgency}
        onChange={(e) => setUrgency(e.target.value)}
      >
        <option value="0">Low (Green)</option>
        <option value="1">Medium (Orange)</option>
        <option value="2">High (Red)</option>
      </Select>

      <Button $toggle={toggle} type="submit">
        Add To-Do
      </Button>
    </FormWrapper>
  );
}

function AddTo({ onAdd, toggle = false }) {
  const [flag, setFlag] = useState(false);

  function handleAddTask(newTask) {
    if (onAdd) {
      onAdd(newTask);
      setFlag(false); // close form after add
    }
  }

  return (
    <>
      <StyledDiv $toggle={toggle} onClick={() => setFlag((prev) => !prev)}>
        <StyledSpan key={flag}>{flag ? "X" : "+"}</StyledSpan>
      </StyledDiv>
      {flag && <TodoForm onAdd={handleAddTask} toggle={toggle} />}
    </>
  );
}

export default AddTo;
