import React, { useState } from "react";
import styled from "styled-components";
import CustomCard from "./CustomCard";
import InputForm from "./InputForm";
import { useToggle } from "../ToggleContext";

const StyledMain = styled.div`
  border-radius: 20px;
  height: 36.5vh;
  min-height: 300px;
  background: ${(props) =>
    !props.$toggle
      ? "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)"
      : "#1f2937"};
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  margin-bottom: 1.5rem;
  padding: 0 0rem 1.5rem 0rem;

  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    height: auto;
    min-height: 250px;
    max-height: 60vh;
    border-radius: 16px;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    border-radius: 12px;
    min-height: 200px;
    max-height: 50vh;
  }

  &::-webkit-scrollbar {
    width: 6px;

    @media (max-width: 768px) {
      width: 4px;
    }
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
    border-radius: 3px;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: 20px 20px 0 0;

    @media (max-width: 768px) {
      border-radius: 16px 16px 0 0;
    }

    @media (max-width: 480px) {
      border-radius: 12px 12px 0 0;
    }
  }
`;

const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2.5rem 1rem 2.5rem;
  margin-top: 4px;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1.5rem 2rem 0.75rem 2rem;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 1.5rem 0.5rem 1.5rem;
    gap: 0.5rem;
    flex-direction: column;
    align-items: flex-start;
  }

  @media (max-width: 320px) {
    padding: 0.75rem 1rem 0.5rem 1rem;
  }
`;

const DateTitle = styled.h4`
  font-size: 1.6rem;
  font-weight: 700;
  color: ${({ $toggle }) => ($toggle ? "#f1f5f9" : "#1e293b")};
  background: ${({ $toggle }) =>
    !$toggle
      ? "linear-gradient(135deg, #1e293b, #475569)"
      : "linear-gradient(135deg, #e0e7ff, #c7d2fe)"};
  margin: 0;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  word-break: break-word;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
    flex: none;
    width: 100%;
    text-align: center;
  }

  @media (max-width: 320px) {
    font-size: 1.2rem;
  }
`;

const AddButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  font-size: 1.8rem;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 1.6rem;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 200px;
    height: 40px;
    border-radius: 8px;
    font-size: 1.4rem;
    align-self: center;
  }

  @media (max-width: 320px) {
    height: 36px;
    font-size: 1.3rem;
  }

  &:hover {
    background: linear-gradient(135deg, #1d4ed8, #1e40af);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);

    @media (max-width: 480px) {
      transform: translateY(-1px);
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }

  /* Touch devices */
  @media (hover: none) and (pointer: coarse) {
    &:hover {
      transform: none;
    }

    &:active {
      transform: scale(0.98);
    }
  }
`;

const ContentContainer = styled.div`
  padding: 0 1.5rem 1.5rem 1.5rem;

  @media (max-width: 768px) {
    padding: 0 1.25rem 1.25rem 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 0 1rem 1rem 1rem;
  }

  @media (max-width: 320px) {
    padding: 0 0.75rem 0.75rem 0.75rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${(props) => (!props.$toggle ? "#64748b" : "#94a3b8")};
  font-size: 1.4rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    padding: 1.5rem;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    padding: 1rem;
    gap: 0.5rem;
  }

  @media (max-width: 320px) {
    font-size: 1.1rem;
    padding: 0.75rem;
  }

  p {
    margin: 0;
    line-height: 1.4;
  }
`;

const EmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${(props) =>
    !props.$toggle
      ? "linear-gradient(135deg, #ddd6fe, #e0e7ff)"
      : "linear-gradient(135deg, #4338ca, #1e3a8a)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    width: 42px;
    height: 42px;
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
  }

  @media (max-width: 320px) {
    width: 32px;
    height: 32px;
    font-size: 1.1rem;
  }
`;

function AddEvent({
  selectedDay,
  selectedMonth,
  selectedYear,
  onSubmit,
  selectedEvents,
}) {
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEPT",
    "OCT",
    "NOV",
    "DEC",
  ];

  const [click, setClick] = useState(false);

  const handleFormSubmit = (data) => {
    onSubmit(data);
    setClick(false);
  };

  const { toggle } = useToggle();

  return (
    <StyledMain $toggle={toggle}>
      <StyledRow>
        <DateTitle $toggle={toggle}>
          {selectedDay + " " + months[selectedMonth] + " " + selectedYear}
        </DateTitle>
        <AddButton onClick={() => setClick(!click)}>
          {click ? "×" : "+"}
        </AddButton>
      </StyledRow>

      <ContentContainer>
        {click && (
          <InputForm
            selectedDay={selectedDay}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onSubmit={handleFormSubmit}
          />
        )}

        {selectedEvents.length === 0 ? (
          <EmptyState $toggle={toggle}>
            <EmptyIcon $toggle={toggle}>📝</EmptyIcon>
            <p>No events for this day</p>
          </EmptyState>
        ) : (
          <CustomCard selectedEvents={selectedEvents} />
        )}
      </ContentContainer>
    </StyledMain>
  );
}

export default AddEvent;
