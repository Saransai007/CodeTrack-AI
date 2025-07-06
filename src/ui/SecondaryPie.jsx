import React, { useMemo } from "react";
import styled from "styled-components";
import PieCharts from "./PieCharts";
import { useToggle } from "../ToggleContext";

// Professional container with enhanced styling
const StyledDiv = styled.div`
  background: ${(props) =>
    props.$toggle
      ? `linear-gradient(145deg, var(--color-dark-800, #1f2937) 0%, var(--color-dark-900, #111827) 100%)`
      : `linear-gradient(145deg, var(--color-grey-0, #ffffff) 0%, var(--color-grey-50, #f9fafb) 100%)`};

  border: ${(props) =>
    props.$toggle
      ? "1px solid var(--color-dark-600, #4b5563)"
      : "1px solid var(--color-grey-200, #e5e7eb)"};

  border-radius: 20px;
  padding: 2.5rem 3rem;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  min-height: 300px;
  display: flex;
  flex-direction: column;

  box-shadow: ${(props) =>
    props.$toggle
      ? `0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)`
      : `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`};

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

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
    background: ${(props) =>
      props.$toggle
        ? `radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)`
        : `radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)`};
    pointer-events: none;
  }
`;

// Enhanced header with professional styling
const HeaderContainer = styled.div`
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  flex-shrink: 0;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.025em;
    background: ${(props) =>
      props.$toggle
        ? `linear-gradient(135deg, var(--color-dark-50, #f9fafb) 0%, var(--color-dark-200, #e5e7eb) 100%)`
        : `linear-gradient(135deg, var(--color-grey-900, #111827) 0%, var(--color-grey-700, #374151) 100%)`};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
    display: inline-block;

    &::after {
      content: "";
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 60px;
      height: 3px;
      background: ${(props) =>
        props.$toggle
          ? `linear-gradient(90deg, var(--color-blue-400, #60a5fa) 0%, var(--color-indigo-400, #818cf8) 50%, var(--color-purple-400, #a78bfa) 100%)`
          : `linear-gradient(90deg, var(--color-blue-500, #3b82f6) 0%, var(--color-indigo-500, #6366f1) 50%, var(--color-purple-500, #8b5cf6) 100%)`};
      border-radius: 2px;
    }
  }
`;

// Enhanced chart container with better spacing
const ChartContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 280px;
  flex: 1;
  animation: fadeInUp 0.6s ease-out;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Statistics summary component - now sticky to bottom
const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: ${(props) =>
    props.$toggle
      ? "1px solid var(--color-dark-600, #4b5563)"
      : "1px solid var(--color-grey-200, #e5e7eb)"};
  flex-shrink: 0;
  position: relative;
  z-index: 1;
`;

const StatItem = styled.div`
  text-align: center;
  flex: 1;

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    color: ${(props) =>
      props.$toggle
        ? "var(--color-dark-50, #f9fafb)"
        : "var(--color-grey-900, #111827)"};
  }

  .stat-label {
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${(props) =>
      props.$toggle
        ? "var(--color-dark-400, #9ca3af)"
        : "var(--color-grey-500, #6b7280)"};
  }

  /* Platform-specific colors (these remain the same in both modes) */
  &.leetcode .stat-value {
    background: linear-gradient(135deg, #ffa116 0%, #ff8c00 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &.codeforces .stat-value {
    background: linear-gradient(135deg, #1f8aed 0%, #0066cc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &.codechef .stat-value {
    background: linear-gradient(135deg, #5b4638 0%, #8b4513 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

// Error boundary component
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  flex: 1;
  color: ${(props) =>
    props.$toggle
      ? "var(--color-red-400, #f87171)"
      : "var(--color-red-500, #ef4444)"};
  text-align: center;

  h3 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
    opacity: 0.8;
    color: ${(props) =>
      props.$toggle
        ? "var(--color-dark-300, #d1d5db)"
        : "var(--color-grey-600, #4b5563)"};
  }
`;

// Loading state component
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  flex: 1;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid
    ${(props) =>
      props.$toggle
        ? "var(--color-dark-600, #4b5563)"
        : "var(--color-grey-200, #e5e7eb)"};
  border-top: 4px solid
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

function SecondaryPie({
  codeData1,
  data1,
  forceData1,
  codeData,
  data,
  forceData,
}) {
  const { toggle } = useToggle();

  const chartData = useMemo(() => {
    try {
      console.log(data[data.length - 1].rating);
      console.log(codeData[codeData.length - 1].rating);
      console.log(forceData[forceData.length - 1].rating);
      const safeNumber = (value, fallback = 0) => {
        const num = Number(value);
        return isNaN(num) ? fallback : num;
      };

      const leetcodeProblems = safeNumber(data1.leetcodeSolved);
      const leetcodeRating = safeNumber(data[data.length - 1].rating, 1400);
      const leetcodeNormal =
        leetcodeProblems + Math.max(0, leetcodeRating - 1400);

      const codechefProblems = safeNumber(codeData1.codechefSolved);
      const codechefRating = safeNumber(
        codeData[codeData.length - 1].rating,
        1000
      );
      const codechefNormal =
        codechefProblems + Math.max(0, codechefRating - 1000);

      const codeforceProblems = safeNumber(forceData1.codeforcesSolved);
      const codeforceRating = safeNumber(
        forceData[forceData.length - 1].rating,
        800
      );
      const codeforceNormal =
        codeforceProblems + Math.max(0, codeforceRating - 800);

      return [
        {
          name: "LeetCode",
          value: leetcodeNormal,
          color: "#ffa116",
          problems: leetcodeProblems,
          rating: leetcodeRating,
        },
        {
          name: "CodeForces",
          value: codeforceNormal,
          color: "#1f8aed",
          problems: codeforceProblems,
          rating: codeforceRating,
        },
        {
          name: "CodeChef",
          value: codechefNormal,
          color: "#5b4638",
          problems: codechefProblems,
          rating: codechefRating,
        },
      ];
    } catch (error) {
      console.error("Error calculating chart data:", error);
      return null;
    }
  }, [codeData1, data1, forceData1, codeData, data, forceData]);

  // Loading state
  if (!chartData) {
    return (
      <StyledDiv $toggle={toggle}>
        <HeaderContainer $toggle={toggle}>
          <h2>Contribution Analysis</h2>
        </HeaderContainer>
        <LoadingContainer>
          <LoadingSpinner $toggle={toggle} />
        </LoadingContainer>
      </StyledDiv>
    );
  }

  // Error state
  if (chartData.every((item) => item.value === 0)) {
    return (
      <StyledDiv $toggle={toggle}>
        <HeaderContainer $toggle={toggle}>
          <h2>Contribution Analysis</h2>
        </HeaderContainer>
        <ErrorContainer $toggle={toggle}>
          <h3>No Data Available</h3>
          <p>Unable to calculate contribution metrics</p>
        </ErrorContainer>
      </StyledDiv>
    );
  }

  return (
    <StyledDiv $toggle={toggle}>
      <HeaderContainer $toggle={toggle}>
        <h2>Contribution Analysis</h2>
      </HeaderContainer>

      <ChartContainer>
        <PieCharts chartdata={chartData} $toggle={toggle} />
      </ChartContainer>

      <StatsContainer $toggle={toggle}>
        {chartData.map((item, index) => (
          <StatItem
            key={index}
            className={item.name.toLowerCase()}
            $toggle={toggle}
          >
            <div className="stat-value">{item.value.toLocaleString()}</div>
            <div className="stat-label">{item.name}</div>
          </StatItem>
        ))}
      </StatsContainer>
    </StyledDiv>
  );
}

export default SecondaryPie;
