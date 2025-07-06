import React from "react";
import styled from "styled-components";
import { useToggle } from "../ToggleContext";

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: ${(props) => (props.$toggle ? "#1e293b" : "#ffffff")};
  border: 1px solid ${(props) => (props.$toggle ? "#334155" : "#e2e8f0")};
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  color: ${(props) => (props.$toggle ? "#f1f5f9" : "#1e293b")};
  margin-bottom: 1rem;
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.$toggle ? "#475569" : "#cbd5e1")};
  background-color: ${(props) => (props.$toggle ? "#0f172a" : "#ffffff")};
  color: ${(props) => (props.$toggle ? "#f1f5f9" : "#1e293b")};

  &::placeholder {
    color: ${(props) => (props.$toggle ? "#94a3b8" : "#64748b")};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.$toggle ? "#475569" : "#cbd5e1")};
  background-color: ${(props) => (props.$toggle ? "#0f172a" : "#ffffff")};
  color: ${(props) => (props.$toggle ? "#f1f5f9" : "#1e293b")};

  &::placeholder {
    color: ${(props) => (props.$toggle ? "#94a3b8" : "#64748b")};
  }

  resize: vertical;
`;

const SubmitButton = styled.button`
  padding: 0.8rem 1.2rem;
  background-color: ${(props) => (props.$toggle ? "#2563eb" : "#3b82f6")};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  align-self: flex-end;
  transition: background 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.$toggle ? "#1d4ed8" : "#2563eb")};
  }
`;

function InputForm({ onSubmit, selectedDay, selectedMonth, selectedYear }) {
  const { toggle } = useToggle();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const fullDate =
      selectedYear + "-" + Number(selectedMonth + 1) + "-" + selectedDay;
    data.date = fullDate;
    if (onSubmit) onSubmit(data);
    else console.log(data);
  };

  return (
    <FormWrapper onSubmit={handleSubmit} $toggle={toggle}>
      <Row>
        <Input type="time" name="startTime" required $toggle={toggle} />
        <Input
          type="time"
          name="endTime"
          required
          max="23:59"
          $toggle={toggle}
        />
      </Row>

      <Input
        type="text"
        name="title"
        placeholder="Title"
        required
        $toggle={toggle}
      />

      <Input
        type="text"
        name="type"
        placeholder="Type (e.g. Meeting, Break, Work)"
        required
        $toggle={toggle}
      />

      <Textarea
        name="description"
        rows="4"
        placeholder="Description"
        required
        $toggle={toggle}
      />

      <SubmitButton type="submit" $toggle={toggle}>
        Add Task
      </SubmitButton>
    </FormWrapper>
  );
}

export default InputForm;
