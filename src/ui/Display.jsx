import React from "react";
import styled from "styled-components";
import { FaEquals } from "react-icons/fa";
import * as TbIcons from "react-icons/si";
import { useToggle } from "../ToggleContext";

const Card = styled.div`
  background: ${(props) =>
    props.$toggle
      ? "linear-gradient(145deg, var(--color-dark-800, #1f2937) 0%, var(--color-dark-900, #111827) 100%)"
      : "linear-gradient(145deg, var(--color-grey-0, #ffffff) 0%, var(--color-grey-50, #f9fafb) 100%)"};

  border: ${(props) =>
    props.$toggle
      ? "1px solid var(--color-dark-600, #4b5563)"
      : "1px solid var(--color-grey-200, #e5e7eb)"};

  border-radius: clamp(12px, 2vw, 20px);
  padding: clamp(1.5rem, 3vw, 2.5rem) clamp(2rem, 4vw, 3rem);
  display: flex;
  align-items: center;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  width: 100%;
  min-height: clamp(100px, 15vw, 120px);

  box-shadow: ${(props) =>
    props.$toggle
      ? `0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)`
      : `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`};

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.$toggle
        ? `0 10px 25px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)`
        : `0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`};
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    background: ${(props) =>
      props.$toggle
        ? `radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)`
        : `radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)`};
  }

  /* Mobile adjustments */
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 1.5rem;
    min-height: 140px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    min-height: 120px;
  }
`;

const IconWrapper = styled.div`
  height: clamp(5rem, 8vw, 7rem);
  width: clamp(5rem, 8vw, 7rem);
  border-radius: clamp(12px, 2vw, 16px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-shrink: 0;

  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: clamp(12px, 2vw, 16px);
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
  }

  @media (max-width: 768px) {
    height: 4rem;
    width: 4rem;
  }
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  flex: 1;

  @media (max-width: 768px) {
    flex: none;
  }
`;

const StyledPara = styled.p`
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.025em;

  color: ${(props) =>
    props.$toggle ? `#f9fafb` : `var(--color-grey-900, #111827)`};

  background: ${(props) =>
    props.$toggle
      ? `linear-gradient(135deg, var(--color-dark-50, #f9fafb) 0%, var(--color-dark-200, #e5e7eb) 100%)`
      : `linear-gradient(135deg, var(--color-grey-900, #111827) 0%, var(--color-grey-700, #374151) 100%)`};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const StyledParaHead = styled.p`
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  margin: 0;
  opacity: 0.8;

  color: ${(props) =>
    props.$toggle
      ? `var(--color-dark-400, #9ca3af)`
      : `var(--color-grey-400, #6b7280)`};

  transition: opacity 0.2s ease-in-out;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  svg {
    transition: all 0.2s ease-in-out;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    width: clamp(20px, 3vw, 32px);
    height: clamp(20px, 3vw, 32px);
  }

  ${IconWrapper}:hover svg {
    transform: scale(1.1);
  }
`;

function Display({
  problems,
  icon,
  platform,
  BackGround,
  color,
  darkbg,
  darkcol,
}) {
  const IconComponent = TbIcons[icon];
  const { toggle } = useToggle();

  return (
    <Card $toggle={toggle}>
      <IconWrapper style={{ backgroundColor: toggle ? darkbg : BackGround }}>
        <IconContainer>
          {icon === "Equals" ? (
            <FaEquals size={24} color={color} />
          ) : (
            IconComponent && (
              <IconComponent size={32} color={toggle ? darkcol : color} />
            )
          )}
        </IconContainer>
      </IconWrapper>
      <TextGroup>
        <StyledParaHead $toggle={toggle}>{platform}</StyledParaHead>
        <StyledPara $toggle={toggle}>{problems || "0"}</StyledPara>
      </TextGroup>
    </Card>
  );
}

export default Display;
