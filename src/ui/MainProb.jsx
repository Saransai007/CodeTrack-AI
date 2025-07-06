import React from "react";
import styled from "styled-components";
import * as SiIcons from "react-icons/si";
import Button from "./Button";
import { TbBrandLeetcode } from "react-icons/tb";
import * as TbIcons from "react-icons/si";
import { useToggle } from "../ToggleContext";

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
  align-items: center;
  gap: clamp(1rem, 2vw, 2rem);
  padding: clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem);
  border-bottom: 1px solid
    ${(props) =>
      props.$toggle
        ? "var(--color-dark-600, #4b5563)"
        : "var(--color-grey-100, #f3f4f6)"};

  border-radius: clamp(8px, 1vw, 12px);
  margin-bottom: clamp(0.25rem, 0.5vw, 0.5rem);

  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.$toggle ? "rgba(99, 102, 241, 0.05)" : "rgba(99, 102, 241, 0.02)"};
    transform: translateX(2px);
  }

  /* Large desktop screens */
  @media (min-width: 1440px) {
    grid-template-columns: 10rem 2.5rem 1fr 8rem 10rem;
    gap: 2.5rem;
    padding: 1.25rem 2.5rem;
  }

  /* Desktop screens */
  @media (max-width: 1200px) {
    grid-template-columns: 8rem 2rem 1fr 6rem 8rem;
    gap: 1.5rem;
    padding: 1rem 1.5rem;
  }

  /* Large tablet screens */
  @media (max-width: 1024px) {
    grid-template-columns: 7rem 1.5rem 1fr 5rem 7rem;
    gap: 1.25rem;
    padding: 0.875rem 1.25rem;
  }

  /* Medium tablet screens */
  @media (max-width: 900px) {
    grid-template-columns: 6rem 1.5rem 1fr 4rem 6rem;
    gap: 1rem;
    padding: 0.75rem 1rem;
  }

  /* Small tablet screens - start simplifying layout */
  @media (max-width: 768px) {
    grid-template-columns: auto auto 1fr auto;
    gap: 0.75rem;
    padding: 0.75rem 1rem;

    /* Hide tag column on small tablets */
    > *:nth-child(4) {
      display: none;
    }
  }

  /* Mobile screens - stack vertically */
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1rem;
    text-align: left;

    /* Reset all children to block display */
    > * {
      justify-self: stretch;
    }

    /* Create mobile layout structure */
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    /* Mobile header row */
    .mobile-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .mobile-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .mobile-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 0.5rem;
    }
  }

  /* Small mobile screens */
  @media (max-width: 480px) {
    padding: 0.875rem;
    gap: 0.625rem;

    .mobile-header {
      gap: 0.75rem;
    }

    .mobile-footer {
      flex-direction: column;
      align-items: stretch;
      gap: 0.75rem;
    }
  }

  /* Extra small mobile screens */
  @media (max-width: 360px) {
    padding: 0.75rem;
    gap: 0.5rem;
  }
`;

const StyledDiff = styled.div`
  text-transform: uppercase;
  font-size: clamp(0.875rem, 2vw, 1.1rem);
  font-weight: 600;
  padding: clamp(0.3rem, 1vw, 0.4rem) clamp(0.8rem, 2vw, 1.2rem);
  border-radius: 100px;
  color: var(--color-green-700);
  background-color: var(--color-green-100);
  text-align: center;
  white-space: nowrap;
  min-width: fit-content;

  ${(props) =>
    props.$type === "Medium" &&
    `
      color: var(--color-yellow-700);
      background-color: var(--color-yellow-100);
    `}
  ${(props) =>
    props.$type === "Hard" &&
    `
      color: var(--color-red-700);
      background-color: var(--color-red-100);
    `}

  /* Mobile adjustments */
  @media (max-width: 640px) {
    font-size: 0.9rem;
    padding: 0.35rem 1rem;
    flex-shrink: 0;
  }

  @media (max-width: 480px) {
    font-size: 0.825rem;
    padding: 0.3rem 0.875rem;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.$toggle ? "var(--color-grey-300)" : "var(--color-grey-600)"};

  svg {
    width: clamp(20px, 3vw, 24px);
    height: clamp(20px, 3vw, 24px);
  }

  @media (max-width: 640px) {
    flex-shrink: 0;
  }
`;

const StyledName = styled.div`
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  line-height: 1.4;
  word-break: break-word;
  color: ${(props) =>
    props.$toggle ? "var(--color-grey-100)" : "var(--color-grey-800)"};

  /* Ensure text doesn't overflow */
  overflow-wrap: break-word;
  hyphens: auto;

  @media (max-width: 1024px) {
    font-size: clamp(0.95rem, 2.2vw, 1.1rem);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.3;
  }

  @media (max-width: 640px) {
    font-size: 1.05rem;
    line-height: 1.35;
    margin: 0.25rem 0;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const StyledTag = styled.div`
  font-size: clamp(0.9rem, 2vw, 1rem);
  color: ${(props) =>
    props.$toggle ? "var(--color-grey-300)" : "var(--color-grey-600)"};
  text-align: center;
  padding: clamp(0.25rem, 0.5vw, 0.375rem) clamp(0.5rem, 1vw, 0.75rem);
  background-color: ${(props) =>
    props.$toggle
      ? "var(--color-dark-700, #374151)"
      : "var(--color-grey-50, #f9fafb)"};
  border-radius: clamp(6px, 1vw, 8px);
  border: 1px solid
    ${(props) =>
      props.$toggle
        ? "var(--color-dark-600, #4b5563)"
        : "var(--color-grey-200, #e5e7eb)"};

  /* Truncate long tags */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;

  @media (max-width: 1024px) {
    font-size: 0.875rem;
    padding: 0.3rem 0.6rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    display: block;
    width: 100%;
  }

  button {
    width: 100%;
    font-size: clamp(0.8rem, 1.8vw, 0.9rem);
    padding: clamp(0.4rem, 1vw, 0.6rem) clamp(0.8rem, 2vw, 1.2rem);
  }

  @media (max-width: 640px) {
    margin-top: 0.25rem;

    button {
      padding: 0.6rem 1.5rem;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    button {
      padding: 0.65rem 1.25rem;
      font-size: 0.875rem;
    }
  }
`;

// Mobile-specific wrapper components
const MobileHeader = styled.div`
  display: none;

  @media (max-width: 640px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
`;

const MobileContent = styled.div`
  display: none;

  @media (max-width: 640px) {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const MobileFooter = styled.div`
  display: none;

  @media (max-width: 640px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 0.5rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

// Desktop layout wrapper
const DesktopLayout = styled.div`
  display: contents;

  @media (max-width: 640px) {
    display: none;
  }
`;

function MainProb({ platform, name, difficulty, link, tag }) {
  const IconComponent = TbIcons[platform];
  const { toggle } = useToggle();

  return (
    <StyledDiv $toggle={toggle}>
      {/* Desktop Layout (hidden on mobile) */}
      <DesktopLayout>
        <StyledDiff $type={difficulty}>{difficulty}</StyledDiff>
        <IconContainer $toggle={toggle}>
          {IconComponent && <IconComponent />}
        </IconContainer>
        <StyledName $toggle={toggle}>{name}</StyledName>
        <StyledTag $toggle={toggle}>{tag}</StyledTag>
        <ButtonContainer>
          <a href={link} target="_blank" rel="noopener noreferrer">
            <Button variation="primary" size="small">
              Link
            </Button>
          </a>
        </ButtonContainer>
      </DesktopLayout>

      {/* Mobile Layout (hidden on desktop) */}
      <MobileHeader>
        <StyledDiff $type={difficulty}>{difficulty}</StyledDiff>
        <IconContainer $toggle={toggle}>
          {IconComponent && <IconComponent />}
        </IconContainer>
      </MobileHeader>

      <MobileContent>
        <StyledName $toggle={toggle}>{name}</StyledName>
        <StyledTag $toggle={toggle}>{tag}</StyledTag>
      </MobileContent>

      <MobileFooter>
        <ButtonContainer>
          <a href={link} target="_blank" rel="noopener noreferrer">
            <Button variation="primary" size="small">
              Open Problem
            </Button>
          </a>
        </ButtonContainer>
      </MobileFooter>
    </StyledDiv>
  );
}

export default MainProb;
