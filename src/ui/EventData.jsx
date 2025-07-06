// EventData.jsx
import React from "react";
import styled from "styled-components";
import CardCalen from "./CardCalen";
import { useToggle } from "../ToggleContext";

const StyledDiv = styled.div`
  background: ${(props) =>
    !props.$toggle
      ? "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)"
      : "#1f2937"};
  border: ${(props) =>
    !props.$toggle ? "1px solid var(--color-grey-200)" : "1px solid #111827"};
  height: 77vh;
  border-radius: 20px;

  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1rem;

  @media (max-width: 768px) {
    height: auto;
    padding: 1rem 0.5rem;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${(props) =>
      !props.$toggle
        ? "linear-gradient(135deg, #e2e8f0, #cbd5e1)"
        : "linear-gradient(135deg, #4b5563, #6b7280)"};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) =>
      !props.$toggle
        ? "linear-gradient(135deg, #cbd5e1, #94a3b8)"
        : "linear-gradient(135deg, #6b7280, #9ca3af)"};
  }
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${(props) =>
    !props.$toggle
      ? "linear-gradient(135deg, #ddd6fe, #e0e7ff)"
      : "linear-gradient(135deg, #4338ca, #1e3a8a)"};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: ${(props) => (props.$toggle ? "#c7d2fe" : "#6366f1")};
`;

const EmptyStateText = styled.p`
  color: ${(props) => (props.$toggle ? "#cbd5e1" : "#64748b")};
  font-size: 1.6rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const EmptyStateSubtext = styled.p`
  color: ${(props) => (props.$toggle ? "#9ca3af" : "#94a3b8")};
  font-size: 1.4rem;
`;

const ContentContainer = styled.div`
  padding: 1rem;
`;

function EventData({ events }) {
  const { toggle } = useToggle();
  return (
    <StyledDiv $toggle={toggle}>
      {events.length === 0 ? (
        <EmptyStateContainer>
          <EmptyStateIcon $toggle={toggle}>📅</EmptyStateIcon>
          <EmptyStateText $toggle={toggle}>No events scheduled</EmptyStateText>
          <EmptyStateSubtext $toggle={toggle}>
            Your day is free! Add some events to get started.
          </EmptyStateSubtext>
        </EmptyStateContainer>
      ) : (
        <ContentContainer>
          <CardCalen events={events} />
        </ContentContainer>
      )}
    </StyledDiv>
  );
}

export default EventData;
