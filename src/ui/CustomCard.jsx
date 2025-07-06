import React from "react";
import styled from "styled-components";
import { FaRegCalendarAlt, FaClock, FaTrash, FaCode } from "react-icons/fa";
import { useToggle } from "../ToggleContext";

const CardContainer = styled.div`
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
  }
`;

const Card = styled.div`
  background: ${(props) =>
    props.$toggle
      ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
      : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)"};
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: ${(props) =>
    props.$toggle
      ? "0 2px 8px rgba(255, 255, 255, 0.05)"
      : "0 2px 8px rgba(0, 0, 0, 0.06)"};
  border: 1px solid ${(props) => (props.$toggle ? "#334155" : "#e2e8f0")};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${(props) => {
      if (props.$isContest) {
        switch (props.$platform) {
          case "leetcode":
            return "linear-gradient(to bottom, #ffa116, #ff7c00)";
          case "codeforces":
            return "linear-gradient(to bottom, #1f8dd6, #0066cc)";
          case "codechef":
            return "linear-gradient(to bottom, #5b4638, #8b6914)";
          default:
            return props.$toggle
              ? "linear-gradient(to bottom, #0ea5e9, #6366f1)"
              : "linear-gradient(to bottom, #3b82f6, #8b5cf6)";
        }
      }
      return props.$toggle
        ? "linear-gradient(to bottom, #0ea5e9, #6366f1)"
        : "linear-gradient(to bottom, #3b82f6, #8b5cf6)";
    }};
    border-radius: 0 2px 2px 0;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.$toggle
        ? "0 8px 25px rgba(255, 255, 255, 0.08)"
        : "0 8px 25px rgba(0, 0, 0, 0.1)"};
    border-color: ${(props) => (props.$toggle ? "#0ea5e9" : "#3b82f6")};
  }

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 0.875rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 1rem;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const TimeRow = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => (props.$toggle ? "#cbd5e1" : "#64748b")};
  font-size: 1.3rem;
  gap: 8px;
  font-weight: 500;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    gap: 6px;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    gap: 4px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DeleteButton = styled.button`
  background: ${(props) =>
    props.$toggle
      ? "linear-gradient(135deg, #dc2626, #b91c1c)"
      : "linear-gradient(135deg, #ef4444, #dc2626)"};
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.2rem;
  box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);

  &:hover {
    background: linear-gradient(135deg, #b91c1c, #991b1b);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(220, 38, 38, 0.2);
  }

  @media (max-width: 768px) {
    padding: 0.4rem;
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    padding: 0.35rem;
    font-size: 1rem;
  }
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(props) => (props.$toggle ? "#f1f5f9" : "#1e293b")};
  line-height: 1.4;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
    line-height: 1.3;
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 480px) {
    gap: 0.25rem;
  }
`;

const TypeBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background: ${(props) =>
    props.$toggle
      ? "linear-gradient(135deg, #334155, #475569)"
      : "linear-gradient(135deg, #dbeafe, #bfdbfe)"};
  color: ${(props) => (props.$toggle ? "#60a5fa" : "#1d4ed8")};
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.2rem 0.6rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.15rem 0.5rem;
    letter-spacing: 0.25px;
  }
`;

const ContestBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.75rem;
  background: ${(props) => {
    switch (props.$platform) {
      case "leetcode":
        return props.$toggle
          ? "linear-gradient(135deg, #ffa116, #ff7c00)"
          : "linear-gradient(135deg, #fff3cd, #ffeaa7)";
      case "codeforces":
        return props.$toggle
          ? "linear-gradient(135deg, #1f8dd6, #0066cc)"
          : "linear-gradient(135deg, #cce7ff, #99d6ff)";
      case "codechef":
        return props.$toggle
          ? "linear-gradient(135deg, #5b4638, #8b6914)"
          : "linear-gradient(135deg, #f4f1e8, #e8dcc0)";
      default:
        return props.$toggle
          ? "linear-gradient(135deg, #334155, #475569)"
          : "linear-gradient(135deg, #dbeafe, #bfdbfe)";
    }
  }};
  color: ${(props) => {
    switch (props.$platform) {
      case "leetcode":
        return props.$toggle ? "#fff" : "#cc7a00";
      case "codeforces":
        return props.$toggle ? "#fff" : "#0066cc";
      case "codechef":
        return props.$toggle ? "#fff" : "#5b4638";
      default:
        return props.$toggle ? "#60a5fa" : "#1d4ed8";
    }
  }};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-transform: capitalize;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.2rem 0.6rem;
    gap: 0.25rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 0.15rem 0.5rem;
  }
`;

const ContestDot = styled.div`
  width: 8px;
  height: 8px;
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
      transform: scale(1.1);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (max-width: 480px) {
    width: 6px;
    height: 6px;
  }
`;

function CustomCard({ selectedEvents, contestEvents = [], onDelete }) {
  const { toggle } = useToggle();

  // Combine regular events and contest events
  const allEvents = [
    ...selectedEvents.map((event) => ({ ...event, isContest: false })),
    ...contestEvents.map((contest) => ({
      ...contest,
      isContest: true,
      title: contest.title,
      starttime: contest.time,
      endtime: contest.time,
      type: contest.platform,
    })),
  ];

  // Sort events by time
  const sortedEvents = allEvents.sort((a, b) =>
    a.starttime.localeCompare(b.starttime)
  );

  const handleDelete = (eventId) => {
    if (onDelete) {
      onDelete(eventId);
    }
  };

  const getPlatformName = (platform) => {
    switch (platform) {
      case "leetcode":
        return "LeetCode";
      case "codeforces":
        return "Codeforces";
      case "codechef":
        return "CodeChef";
      default:
        return platform;
    }
  };

  return (
    <>
      {sortedEvents.map((event, index) => (
        <CardContainer
          key={event.isContest ? `contest-${index}` : event.id || index}
        >
          <Card
            $toggle={toggle}
            $isContest={event.isContest}
            $platform={event.platform}
          >
            <CardHeader>
              <TimeRow $toggle={toggle}>
                <FaClock />
                {event.isContest ? (
                  <>
                    <FaCode style={{ marginLeft: "4px" }} />
                    {event.starttime}
                  </>
                ) : (
                  `${event.starttime} – ${event.endtime}`
                )}
              </TimeRow>

              {!event.isContest && (
                <ActionButtons>
                  <DeleteButton
                    $toggle={toggle}
                    onClick={() => handleDelete(event.id)}
                    title="Delete event"
                  >
                    <FaTrash />
                  </DeleteButton>
                </ActionButtons>
              )}
            </CardHeader>

            <Title $toggle={toggle}>{event.title}</Title>

            <BadgeContainer>
              {event.isContest ? (
                <ContestBadge $toggle={toggle} $platform={event.platform}>
                  <ContestDot $platform={event.platform} />
                  {getPlatformName(event.platform)} Contest
                </ContestBadge>
              ) : (
                event.type && (
                  <TypeBadge $toggle={toggle}>{event.type}</TypeBadge>
                )
              )}
            </BadgeContainer>
          </Card>
        </CardContainer>
      ))}
    </>
  );
}

export default CustomCard;
