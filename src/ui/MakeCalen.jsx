import React, { useState } from "react";
import styled from "styled-components";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import CalendarGrid from "./CalendarGrid";
import { useToggle } from "../ToggleContext";

const StyledDiv = styled.div`
  background: ${({ $toggle }) =>
    !$toggle ? "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)" : "#1f2937"};
  border: ${({ $toggle }) =>
    !$toggle ? "1px solid var(--color-grey-200)" : "1px solid #111827"};
  height: 77vh;
  border-radius: 20px;
  box-shadow: ${({ $toggle }) =>
    !$toggle
      ? "0 4px 20px rgba(0, 0, 0, 0.08)"
      : "0 4px 20px rgba(255, 255, 255, 0.04)"};
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: 20px 20px 0 0;
  }

  @media (max-width: 768px) {
    height: 85vh;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    height: 90vh;
    border-radius: 12px;
    box-shadow: ${({ $toggle }) =>
      !$toggle
        ? "0 2px 12px rgba(0, 0, 0, 0.06)"
        : "0 2px 12px rgba(255, 255, 255, 0.03)"};
  }
`;

const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2.5rem 1rem;
  margin-top: 4px;

  @media (max-width: 768px) {
    padding: 1.5rem 2rem 0.75rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 1.5rem 0.5rem;
  }
`;

const MonthTitle = styled.h4`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ $toggle }) => ($toggle ? "#f1f5f9" : "#1e293b")};
  background: ${({ $toggle }) =>
    !$toggle
      ? "linear-gradient(135deg, #1e293b, #475569)"
      : "linear-gradient(135deg, #e0e7ff, #c7d2fe)"};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
    font-weight: 600;
  }

  @media (max-width: 375px) {
    font-size: 1.2rem;
  }
`;

const NavigationContainer = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 480px) {
    gap: 0.375rem;
  }
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 12px;
  background: ${({ $toggle }) =>
    !$toggle
      ? "linear-gradient(135deg, #f1f5f9, #e2e8f0)"
      : "linear-gradient(135deg, #374151, #1f2937)"};
  color: ${({ $toggle }) => ($toggle ? "#e5e7eb" : "#475569")};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${({ $toggle }) =>
    !$toggle
      ? "0 2px 4px rgba(0, 0, 0, 0.05)"
      : "0 2px 4px rgba(255, 255, 255, 0.1)"};

  &:hover {
    background: ${({ $toggle }) =>
      !$toggle
        ? "linear-gradient(135deg, #e2e8f0, #cbd5e1)"
        : "linear-gradient(135deg, #4b5563, #374151)"};
    transform: translateY(-1px);
    box-shadow: ${({ $toggle }) =>
      !$toggle
        ? "0 4px 8px rgba(0, 0, 0, 0.1)"
        : "0 4px 8px rgba(255, 255, 255, 0.15)"};
    color: ${({ $toggle }) => ($toggle ? "#f3f4f6" : "#334155")};
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${({ $toggle }) =>
      !$toggle
        ? "0 1px 2px rgba(0, 0, 0, 0.1)"
        : "0 1px 2px rgba(255, 255, 255, 0.1)"};
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    border-radius: 10px;
  }

  @media (max-width: 375px) {
    width: 28px;
    height: 28px;
    border-radius: 8px;
  }
`;

function MakeCalen({
  onSubmit,
  submittingForm,
  selectedEvents,
  contestEvents,
  onDelete,
}) {
  const months = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];
  const { toggle } = useToggle();
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [fullDate, setFullDate] = useState(months[month] + " " + year);
  const [firstDay, setFirstDay] = useState(new Date(year, month, 1).getDay());
  const [lastDay, setLastDay] = useState(
    new Date(year, month + 1, 0).getDate()
  );

  const IncrementCalen = () => {
    const newMonth = month === 11 ? 0 : month + 1;
    const newYear = month === 11 ? year + 1 : year;

    setMonth(newMonth);
    setYear(newYear);
    setFullDate(months[newMonth] + " " + newYear);
    setFirstDay(new Date(newYear, newMonth, 1).getDay());
    setLastDay(new Date(newYear, newMonth + 1, 0).getDate());
  };

  const DecrementCalen = () => {
    const newMonth = month === 0 ? 11 : month - 1;
    const newYear = month === 0 ? year - 1 : year;

    setMonth(newMonth);
    setYear(newYear);
    setFullDate(months[newMonth] + " " + newYear);
    setFirstDay(new Date(newYear, newMonth, 1).getDay());
    setLastDay(new Date(newYear, newMonth + 1, 0).getDate());
  };

  return (
    <StyledDiv $toggle={toggle}>
      <StyledRow>
        <MonthTitle $toggle={toggle}>{fullDate}</MonthTitle>
        <NavigationContainer>
          <NavButton $toggle={toggle} onClick={DecrementCalen}>
            <FaChevronLeft size={14} />
          </NavButton>
          <NavButton $toggle={toggle} onClick={IncrementCalen}>
            <FaChevronRight size={14} />
          </NavButton>
        </NavigationContainer>
      </StyledRow>
      <CalendarGrid
        firstDay={firstDay}
        lastDay={lastDay}
        month={month}
        year={year}
        onSubmit={onSubmit}
        submittingForm={submittingForm}
        selectedEvents={selectedEvents}
        contestEvents={contestEvents}
        onDelete={onDelete}
      />
    </StyledDiv>
  );
}

export default MakeCalen;
