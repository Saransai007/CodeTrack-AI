// CardCalen.jsx
import React from "react";
import styled from "styled-components";
import { useToggle } from "../ToggleContext";

const CardContainer = styled.div`
  margin: 1rem auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 95%;
  padding: 1.5rem 1rem;
  border-radius: 16px;
  box-sizing: border-box;
  gap: 1rem;

  background: ${(props) =>
    props.$completed
      ? props.$toggle
        ? "#2d3748"
        : "#f7fafc"
      : props.$toggle
      ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
      : "#ffffff"};

  box-shadow: ${(props) =>
    props.$completed
      ? props.$toggle
        ? "0 1px 3px rgba(0, 0, 0, 0.2)"
        : "0 1px 3px rgba(0, 0, 0, 0.1)"
      : props.$toggle
      ? "0 2px 8px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.3)"
      : "0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.08)"};

  border: 1px solid
    ${(props) =>
      props.$completed
        ? props.$toggle
          ? "#4a5568"
          : "#e2e8f0"
        : props.$toggle
        ? "#374151"
        : "var(--color-grey-200)"};

  align-items: flex-start;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: ${(props) => (props.$completed ? "0.6" : "1")};
  filter: ${(props) => (props.$completed ? "grayscale(0.8)" : "none")};

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }

  &:hover {
    transform: ${(props) => (props.$completed ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) =>
      props.$completed
        ? "inherit"
        : props.$toggle
        ? "0 8px 25px rgba(255, 255, 255, 0.12), 0 4px 12px rgba(255, 255, 255, 0.08)"
        : "0 8px 25px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)"};
    border-color: ${(props) =>
      props.$completed ? "inherit" : "var(--color-brand-300, #93c5fd)"};
  }

  &:active {
    transform: ${(props) => (props.$completed ? "none" : "translateY(-1px)")};
  }
`;

const CrossedLineOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  opacity: ${(props) => (props.$completed ? "1" : "0")};
  transition: opacity 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${(props) => (props.$toggle ? "#6b7280" : "#9ca3af")} 20%,
      ${(props) => (props.$toggle ? "#4b5563" : "#6b7280")} 50%,
      ${(props) => (props.$toggle ? "#6b7280" : "#9ca3af")} 80%,
      transparent 100%
    );
    transform: translateY(-50%);
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 2px;
    background: linear-gradient(
      180deg,
      transparent 0%,
      ${(props) => (props.$toggle ? "#6b7280" : "#9ca3af")} 20%,
      ${(props) => (props.$toggle ? "#4b5563" : "#6b7280")} 50%,
      ${(props) => (props.$toggle ? "#6b7280" : "#9ca3af")} 80%,
      transparent 100%
    );
    transform: translateX(-50%);
  }
`;

const CompletedBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${(props) => (props.$toggle ? "#374151" : "#f3f4f6")};
  color: ${(props) => (props.$toggle ? "#9ca3af" : "#6b7280")};
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid ${(props) => (props.$toggle ? "#4b5563" : "#e5e7eb")};
  opacity: ${(props) => (props.$completed ? "1" : "0")};
  transform: ${(props) => (props.$completed ? "scale(1)" : "scale(0)")};
  transition: all 0.3s ease;
`;

const TimeSection = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1.4rem;
  width: 65px;
  font-weight: 500;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: stretch;
  flex: 1;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Line = styled.div`
  width: 4px;
  border-radius: 2px;
  background: ${(props) =>
    props.$completed
      ? props.$toggle
        ? "linear-gradient(to bottom, #4b5563 0%, #6b7280 100%)"
        : "linear-gradient(to bottom, #9ca3af 0%, #6b7280 100%)"
      : "linear-gradient(to bottom, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)"};
`;

const ContentSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const Type = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${(props) =>
    props.$completed ? (props.$toggle ? "#6b7280" : "#9ca3af") : "#1d4ed8"};
`;

const Title = styled.div`
  font-size: 1.7rem;
  font-weight: 700;
  margin: 6px 0 8px 0;
  color: ${(props) =>
    props.$completed
      ? props.$toggle
        ? "#6b7280"
        : "#9ca3af"
      : props.$toggle
      ? "#f9fafb"
      : "#111827"};

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const Description = styled.div`
  font-size: 1.4rem;
  color: ${(props) =>
    props.$completed
      ? props.$toggle
        ? "#6b7280"
        : "#9ca3af"
      : props.$toggle
      ? "#9ca3af"
      : "#6b7280"};

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const AccentDot = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) =>
    props.$completed ? (props.$toggle ? "#6b7280" : "#9ca3af") : "#60a5fa"};
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;

  ${CardContainer}:hover & {
    opacity: ${(props) => (props.$completed ? "0" : "1")};
    transform: ${(props) => (props.$completed ? "scale(0)" : "scale(1)")};
  }
`;

const StatusIndicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: ${(props) =>
    props.$completed
      ? props.$toggle
        ? "linear-gradient(90deg, #4b5563 0%, #6b7280 100%)"
        : "linear-gradient(90deg, #9ca3af 0%, #6b7280 100%)"
      : "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)"};
  border-radius: 16px 16px 0 0;
  opacity: ${(props) => (props.$completed ? "0.5" : "0")};
  transform: ${(props) => (props.$completed ? "scaleX(1)" : "scaleX(0)")};
  transform-origin: left;
  transition: all 0.4s ease;

  ${CardContainer}:hover & {
    opacity: ${(props) => (props.$completed ? "0.5" : "1")};
    transform: scaleX(1);
  }
`;

function CardCalen({ events }) {
  const { toggle } = useToggle();

  const isEventCompleted = (endTime) => {
    const now = new Date();
    const [hours, minutes] =
      endTime.includes("AM") || endTime.includes("PM")
        ? convertTo24Hr(endTime).split(":").map(Number)
        : endTime.split(":").map(Number);
    const current = now.getHours() * 60 + now.getMinutes();
    const eventEnd = hours * 60 + minutes;
    return current > eventEnd;
  };

  const convertTo24Hr = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  return (
    <>
      {events.map((event, index) => {
        const isCompleted = isEventCompleted(event.endtime);
        return (
          <CardContainer key={index} $toggle={toggle} $completed={isCompleted}>
            <CrossedLineOverlay $toggle={toggle} $completed={isCompleted} />
            <CompletedBadge $toggle={toggle} $completed={isCompleted}>
              Completed
            </CompletedBadge>
            <StatusIndicator $toggle={toggle} $completed={isCompleted} />
            <AccentDot $toggle={toggle} $completed={isCompleted} />
            <TimeSection $toggle={toggle} $completed={isCompleted}>
              <div>{event.starttime}</div>
              <div style={{ opacity: 0.7, fontSize: "1.3rem" }}>
                {event.endtime}
              </div>
            </TimeSection>
            <ContentWrapper>
              <Line $toggle={toggle} $completed={isCompleted} />
              <ContentSection>
                <Type $toggle={toggle} $completed={isCompleted}>
                  {event.type}
                </Type>
                <Title $toggle={toggle} $completed={isCompleted}>
                  {event.title}
                </Title>
                <Description $toggle={toggle} $completed={isCompleted}>
                  {event.description}
                </Description>
              </ContentSection>
            </ContentWrapper>
          </CardContainer>
        );
      })}
    </>
  );
}

export default CardCalen;
