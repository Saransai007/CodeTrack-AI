import React, { useEffect, useState } from "react";
import styled from "styled-components";
import MainProb from "./MainProb";
import { useToggle } from "../ToggleContext";

// Professional container with enhanced styling and responsive design
const StyledDiv = styled.div`
  background: ${(props) =>
    props.$toggle
      ? `linear-gradient(
          145deg, 
          var(--color-dark-800, #1f2937) 0%, 
          var(--color-dark-900, #111827) 100%
        )`
      : `linear-gradient(
          145deg,
          var(--color-grey-0, #ffffff) 0%,
          var(--color-grey-50, #f9fafb) 100%
        )`};

  border: ${(props) =>
    props.$toggle
      ? "1px solid var(--color-dark-600, #4b5563)"
      : "1px solid var(--color-grey-200, #e5e7eb)"};

  border-radius: clamp(12px, 2vw, 20px);
  padding: clamp(1rem, 3vw, 2rem) 0;
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;

  box-shadow: ${(props) =>
    props.$toggle
      ? `0 4px 6px -1px rgba(0, 0, 0, 0.3),
         0 2px 4px -1px rgba(0, 0, 0, 0.2)`
      : `0 4px 6px -1px rgba(0, 0, 0, 0.1),
         0 2px 4px -1px rgba(0, 0, 0, 0.06)`};

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: ${(props) =>
      props.$toggle
        ? `0 10px 25px -3px rgba(0, 0, 0, 0.4),
           0 4px 6px -2px rgba(0, 0, 0, 0.3)`
        : `0 10px 25px -3px rgba(0, 0, 0, 0.1),
           0 4px 6px -2px rgba(0, 0, 0, 0.05)`};
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) =>
      props.$toggle
        ? `radial-gradient(
            circle at 80% 20%,
            rgba(99, 102, 241, 0.08) 0%,
            transparent 50%
          )`
        : `radial-gradient(
            circle at 80% 20%,
            rgba(99, 102, 241, 0.03) 0%,
            transparent 50%
          )`};
    pointer-events: none;
  }

  /* Tablet responsiveness */
  @media (max-width: 1024px) {
    padding: clamp(1rem, 2.5vw, 1.5rem) 0;
    border-radius: clamp(10px, 1.5vw, 16px);
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    padding: 1.5rem 0;
    border-radius: 16px;
    height: auto;
    min-height: 400px;
  }

  /* Small mobile responsiveness */
  @media (max-width: 480px) {
    padding: 1.25rem 0;
    border-radius: 12px;
    min-height: 350px;
  }
`;

// Enhanced scrollable list with responsive styling
const Styledul = styled.ul`
  margin: 0;
  padding: 0 clamp(1.5rem, 4vw, 2.5rem);
  flex: 1;
  overflow-y: auto;
  list-style: none;
  min-height: 0;

  /* Dynamic height based on container */
  max-height: calc(100vh - 300px);

  scrollbar-width: thin;
  scrollbar-color: ${(props) =>
    props.$toggle
      ? "var(--color-dark-500, #6b7280) transparent"
      : "var(--color-grey-300, #d1d5db) transparent"};

  &::-webkit-scrollbar {
    width: clamp(4px, 0.5vw, 6px);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) =>
      props.$toggle
        ? "var(--color-dark-500, #6b7280)"
        : "var(--color-grey-300, #d1d5db)"};
    border-radius: 10px;
    transition: background 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) =>
      props.$toggle
        ? "var(--color-dark-400, #9ca3af)"
        : "var(--color-grey-400, #9ca3af)"};
  }

  &::after {
    content: "";
    position: sticky;
    bottom: 0;
    display: block;
    height: 20px;
    background: ${(props) =>
      props.$toggle
        ? "linear-gradient(transparent, var(--color-dark-800, #1f2937))"
        : "linear-gradient(transparent, var(--color-grey-0, #ffffff))"};
    pointer-events: none;
  }

  /* Tablet responsiveness */
  @media (max-width: 1024px) {
    padding: 0 clamp(1.25rem, 3vw, 2rem);
    max-height: calc(100vh - 250px);
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    padding: 0 1.5rem;
    max-height: 300px;
  }

  /* Small mobile responsiveness */
  @media (max-width: 480px) {
    padding: 0 1.25rem;
    max-height: 250px;
  }
`;

// Professional divider with responsive styling
const Styledhr = styled.hr`
  border: none;
  height: 1px;
  background: ${(props) =>
    props.$toggle
      ? `linear-gradient(
          90deg, 
          transparent 0%, 
          var(--color-dark-600, #4b5563) 20%, 
          var(--color-dark-600, #4b5563) 80%, 
          transparent 100%
        )`
      : `linear-gradient(
          90deg,
          transparent 0%,
          var(--color-grey-200, #e5e7eb) 20%,
          var(--color-grey-200, #e5e7eb) 80%,
          transparent 100%
        )`};
  margin: clamp(0.5rem, 1vw, 0.75rem) 0;
  opacity: 0.6;
  transition: opacity 0.2s ease;
`;

// Enhanced header with responsive typography
const HeaderContainer = styled.div`
  padding: 0 clamp(1.5rem, 4vw, 2.5rem) clamp(0.75rem, 2vw, 1rem);
  position: relative;
  flex-shrink: 0;

  h2 {
    font-size: clamp(1.5rem, 4vw, 1.875rem);
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.025em;
    background: ${(props) =>
      props.$toggle
        ? `linear-gradient(
            135deg, 
            var(--color-dark-50, #f9fafb) 0%, 
            var(--color-dark-200, #e5e7eb) 100%
          )`
        : `linear-gradient(
            135deg,
            var(--color-grey-900, #111827) 0%,
            var(--color-grey-700, #374151) 100%
          )`};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: clamp(-6px, -1vw, -8px);
      left: 0;
      width: clamp(30px, 6vw, 40px);
      height: clamp(2px, 0.5vw, 3px);
      background: ${(props) =>
        props.$toggle
          ? `linear-gradient(
              90deg, 
              var(--color-blue-400, #60a5fa) 0%, 
              var(--color-purple-400, #a78bfa) 100%
            )`
          : `linear-gradient(
              90deg,
              var(--color-blue-500, #3b82f6) 0%,
              var(--color-purple-500, #8b5cf6) 100%
            )`};
      border-radius: 2px;
    }
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    padding: 0 1.5rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 0 1.25rem 0.75rem;
  }
`;

// Enhanced list item container with responsive spacing
const StyledListItem = styled.li`
  position: relative;
  transition: all 0.2s ease-in-out;
  border-radius: clamp(8px, 1.5vw, 12px);
  margin: clamp(0.375rem, 1vw, 0.5rem) 0;

  &:hover {
    background: ${(props) =>
      props.$toggle ? "rgba(99, 102, 241, 0.02)" : "rgba(99, 102, 241, 0.05)"};
    transform: translateX(2px);

    ${Styledhr} {
      opacity: 0.8;
    }
  }

  &:first-child ${Styledhr}:first-child {
    display: none;
  }

  &:last-child ${Styledhr}:last-child {
    display: none;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    margin: 0.375rem 0;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    margin: 0.25rem 0;
    border-radius: 8px;
  }
`;

// Responsive loading state component
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-height: clamp(150px, 25vh, 200px);
  color: ${(props) =>
    props.$toggle
      ? "var(--color-dark-400, #9ca3af)"
      : "var(--color-grey-500, #6b7280)"};
`;

const LoadingSpinner = styled.div`
  width: clamp(24px, 5vw, 32px);
  height: clamp(24px, 5vw, 32px);
  border: 3px solid
    ${(props) =>
      props.$toggle
        ? "var(--color-dark-600, #4b5563)"
        : "var(--color-grey-200, #e5e7eb)"};
  border-top: 3px solid
    ${(props) =>
      props.$toggle
        ? "var(--color-blue-400, #60a5fa)"
        : "var(--color-blue-500, #3b82f6)"};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Responsive empty state component
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: clamp(150px, 25vh, 200px);
  color: ${(props) =>
    props.$toggle
      ? "var(--color-dark-400, #9ca3af)"
      : "var(--color-grey-500, #6b7280)"};
  text-align: center;
  padding: clamp(1rem, 3vw, 2rem);

  h3 {
    margin: 0 0 0.5rem;
    font-size: clamp(1.125rem, 3vw, 1.25rem);
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: clamp(0.8rem, 2vw, 0.875rem);
    opacity: 0.8;
  }
`;

function SecondDisplay() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { toggle } = useToggle();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:8000/api/daily-questions"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.questions) {
          const formatted = data.questions.map((q, index) => ({
            id: index,
            name: q.name,
            difficulty: q.difficulty,
            tag: q.tags,
            platform: q.platform,
            link: q.link,
          }));
          setProblems(formatted);
        } else {
          setProblems([]);
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "LeetCode":
        return "SiLeetcode";
      case "CodeChef":
        return "SiCodechef";
      case "CodeForces":
        return "SiCodeforces";
      default:
        return "SiLeetcode";
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <LoadingContainer $toggle={toggle}>
          <LoadingSpinner $toggle={toggle} />
        </LoadingContainer>
      );
    }

    if (error) {
      return (
        <EmptyState $toggle={toggle}>
          <h3>Unable to load problems</h3>
          <p>Please check your connection and try again</p>
        </EmptyState>
      );
    }

    if (problems.length === 0) {
      return (
        <EmptyState $toggle={toggle}>
          <h3>No problems for today</h3>
          <p>Check back later for new challenges</p>
        </EmptyState>
      );
    }

    return (
      <Styledul $toggle={toggle}>
        {problems.map((item, index) => (
          <StyledListItem key={item.id || index} $toggle={toggle}>
            <Styledhr $toggle={toggle} />
            <MainProb
              platform={getPlatformIcon(item.platform)}
              difficulty={item.difficulty}
              tag={item.tag}
              name={item.name}
              link={item.link}
              $toggle={toggle}
            />
          </StyledListItem>
        ))}
      </Styledul>
    );
  };

  return (
    <StyledDiv $toggle={toggle}>
      <HeaderContainer $toggle={toggle}>
        <h2>Today's Challenges</h2>
      </HeaderContainer>
      {renderContent()}
    </StyledDiv>
  );
}

export default SecondDisplay;
