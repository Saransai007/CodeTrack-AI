import React, { useState } from "react";
import styled from "styled-components";
import AddEvent from "./AddEvent";
import { useToggle } from "../ToggleContext";

const CalendarContainer = styled.div`
  width: 100%;
  padding: 0 2rem 1rem 2rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem 0.75rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 0 1rem 0.5rem 1rem;
  }
`;

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 600;
  font-size: 1.2rem;
  color: ${(props) => (!props.$toggle ? "#64748b" : "#cbd5e1")};
  margin-bottom: 1rem;
  padding: 0 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
    padding: 0 0.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    padding: 0;
  }

  @media (max-width: 375px) {
    font-size: 0.9rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;

  @media (max-width: 480px) {
    gap: 2px;
  }
`;

const DayWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  position: relative;

  @media (max-width: 768px) {
    padding: 0.375rem;
  }

  @media (max-width: 480px) {
    padding: 0.25rem;
  }
`;

const DayCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 12px;
  background: ${(props) => {
    if (props.$highlight)
      return props.$toggle
        ? "linear-gradient(135deg, #1e40af,rgb(22, 36, 69))"
        : "linear-gradient(135deg, #3b82f6, #1d4ed8)";
    if (props.$outline)
      return props.$toggle
        ? "linear-gradient(135deg, #334155, #1e293b)"
        : "linear-gradient(135deg, #f1f5f9, #e2e8f0)";
    return "transparent";
  }};
  color: ${(props) => {
    if (props.$highlight) return "#ffffff";
    if (props.$outline) return props.$toggle ? "#e2e8f0" : "#1e293b";
    return props.$toggle ? "#94a3b8" : "#475569";
  }};
  border: ${(props) => (props.$outline ? "2px solid #3b82f6" : "none")};
  font-weight: ${(props) =>
    props.$highlight || props.$outline ? "600" : "500"};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  font-size: 1.3rem;
  box-shadow: ${(props) => {
    if (props.$highlight) return "0 4px 12px rgba(59, 130, 246, 0.3)";
    if (props.$outline) return "0 2px 8px rgba(59, 130, 246, 0.2)";
    return "none";
  }};

  &:hover {
    background: ${(props) =>
      props.$highlight
        ? "linear-gradient(135deg, #1d4ed8, #1e40af)"
        : props.$toggle
        ? "linear-gradient(135deg, #334155, #1e293b)"
        : "linear-gradient(135deg, #f1f5f9, #e2e8f0)"};
    transform: translateY(-1px);
    box-shadow: ${(props) => {
      if (props.$highlight) return "0 6px 16px rgba(59, 130, 246, 0.4)";
      return "0 4px 12px rgba(0, 0, 0, 0.1)";
    }};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 1.2rem;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    font-size: 1.1rem;
    border-radius: 8px;
  }

  @media (max-width: 375px) {
    width: 20px;
    height: 20px;
    font-size: 1rem;
    border-radius: 6px;
  }
`;

const ContestDotsContainer = styled.div`
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2px;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    bottom: 1px;
    gap: 1px;
  }

  @media (max-width: 480px) {
    bottom: 0px;
  }
`;

const ContestDot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${(props) => {
    switch (props.$platform) {
      case "leetcode":
        return "#ffa116";
      case "codeforces":
        return "#1f8dd6";
      case "codechef":
        return "#8b6914";
      default:
        return "#3b82f6";
    }
  }};
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.2);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (max-width: 480px) {
    width: 3px;
    height: 3px;
  }

  @media (max-width: 375px) {
    width: 2px;
    height: 2px;
  }
`;

const EventIndicator = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(props) => (props.$toggle ? "#60a5fa" : "#3b82f6")};

  @media (max-width: 480px) {
    width: 4px;
    height: 4px;
    top: 1px;
    right: 1px;
  }

  @media (max-width: 375px) {
    width: 3px;
    height: 3px;
  }
`;

function CalendarGrid({
  firstDay,
  lastDay,
  month,
  year,
  onSubmit,
  submittingForm,
  selectedEvents,
  contestEvents = [],
  onDelete,
}) {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);

  const { toggle } = useToggle();

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const date = [];
  for (let i = 0; i < firstDay; i++) {
    date.push("");
  }
  for (let i = 1; i <= lastDay; i++) {
    date.push(i);
  }

  const today = new Date().getDate();

  // Function to check if a day has events
  const hasEvents = (day) => {
    if (!day) return false;
    return selectedEvents.some((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  };

  // Function to get contests for a specific day
  const getContestsForDay = (day) => {
    if (!day) return [];
    const dayString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return contestEvents.filter((contest) => contest.date === dayString);
  };

  // Function to get selected day contests
  const getSelectedDayContests = () => {
    const dayString = `${selectedYear}-${String(selectedMonth + 1).padStart(
      2,
      "0"
    )}-${String(selectedDay).padStart(2, "0")}`;
    return contestEvents.filter((contest) => contest.date === dayString);
  };

  return (
    <>
      <CalendarContainer>
        <WeekHeader $toggle={toggle}>
          {weekDays.map((day, index) => (
            <div key={index}>{day}</div>
          ))}
        </WeekHeader>
        <Grid>
          {date.map((day, index) => {
            const contests = getContestsForDay(day);
            const hasRegularEvents = hasEvents(day);

            return (
              <DayWrapper
                key={index}
                onClick={() => {
                  if (day) {
                    setSelectedDay(day);
                    setSelectedMonth(month);
                    setSelectedYear(year);
                    submittingForm(day, month, year);
                  }
                }}
              >
                <DayCircle
                  $highlight={
                    year === new Date().getFullYear() &&
                    month === new Date().getMonth() &&
                    day === today
                  }
                  $outline={
                    selectedDay === day &&
                    selectedMonth === month &&
                    selectedYear === year
                  }
                  $toggle={toggle}
                >
                  {day}
                </DayCircle>

                {/* Regular event indicator */}
                {hasRegularEvents && <EventIndicator $toggle={toggle} />}

                {/* Contest dots */}
                {contests.length > 0 && (
                  <ContestDotsContainer>
                    {contests.map((contest, contestIndex) => (
                      <ContestDot
                        key={contestIndex}
                        $platform={contest.platform}
                        title={`${contest.platform} - ${contest.title}`}
                      />
                    ))}
                  </ContestDotsContainer>
                )}
              </DayWrapper>
            );
          })}
        </Grid>
      </CalendarContainer>
      <AddEvent
        selectedDay={selectedDay}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onSubmit={onSubmit}
        selectedEvents={selectedEvents}
        contestEvents={getSelectedDayContests()}
        onDelete={onDelete}
      />
    </>
  );
}

export default CalendarGrid;
