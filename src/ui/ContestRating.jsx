import React, { useState, useMemo } from "react";
import styled, { css } from "styled-components";
import Row from "./Row";
import Button from "./Button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useToggle } from "../ToggleContext";

// Professional container with enhanced styling
const StyledDiv = styled.div`
  ${({ $darkMode }) => css`
    background: linear-gradient(
      145deg,
      ${$darkMode ? "#1f2937" : "#ffffff"} 0%,
      ${$darkMode ? "#111827" : "#f9fafb"} 100%
    );
    border: 1px solid ${$darkMode ? "#4b5563" : "#e5e7eb"};
    border-radius: 20px;
    padding: 2.5rem 3rem;
    position: relative;
    overflow: hidden;
    min-height: 450px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, ${$darkMode ? 0.3 : 0.1}),
      0 2px 4px -1px rgba(0, 0, 0, ${$darkMode ? 0.2 : 0.06});
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -3px rgba(0, 0, 0, ${$darkMode ? 0.4 : 0.1}),
        0 4px 6px -2px rgba(0, 0, 0, ${$darkMode ? 0.3 : 0.05});
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(
        circle at 20% 80%,
        rgba(139, 92, 246, ${$darkMode ? 0.08 : 0.03}) 0%,
        transparent 50%
      );
      pointer-events: none;
    }
  `}
`;

// Enhanced header row with better spacing
const HeaderRow = styled(Row)`
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.025em;
    background: linear-gradient(
      135deg,
      ${({ $darkMode }) => ($darkMode ? "#f9fafb" : "#111827")} 0%,
      ${({ $darkMode }) => ($darkMode ? "#e5e7eb" : "#374151")} 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 80px;
      height: 3px;
      background: linear-gradient(
        90deg,
        ${({ $darkMode }) => ($darkMode ? "#a78bfa" : "#8b5cf6")} 0%,
        ${({ $darkMode }) => ($darkMode ? "#60a5fa" : "#3b82f6")} 50%,
        ${({ $darkMode }) => ($darkMode ? "#818cf8" : "#6366f1")} 100%
      );
      border-radius: 2px;
    }
  }
`;

// Enhanced button container
const ButtonContainer = styled.div`
  ${({ $darkMode }) => css`
    display: flex;
    gap: 0.5rem;
    background: ${$darkMode ? "#374151" : "#f3f4f6"};
    padding: 0.25rem;
    border-radius: 12px;

    button {
      transition: all 0.2s ease-in-out;
      border-radius: 8px;
      border: none;
      padding: 0.5rem 1rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;

      &.active {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    }
  `}
`;

// Enhanced chart container
const ChartContainer = styled.div`
  ${({ $darkMode }) => css`
    position: relative;
    z-index: 1;
    background: ${$darkMode ? "#1f2937" : "#ffffff"};
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, ${$darkMode ? 0.05 : 0.1}),
      0 1px 3px rgba(0, 0, 0, ${$darkMode ? 0.2 : 0.1});
    min-height: 350px;
    animation: slideUp 0.6s ease-out;

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}
`;

// Statistics summary component
const StatsContainer = styled.div`
  ${({ $darkMode }) => css`
    display: flex;
    justify-content: space-around;
    margin-top: 1.5rem;
    padding: 1.5rem;
    background: ${$darkMode ? "#374151" : "#f9fafb"};
    border-radius: 12px;
    border: 1px solid ${$darkMode ? "#4b5563" : "#e5e7eb"};
  `}
`;

const StatItem = styled.div`
  text-align: center;
  flex: 1;

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ $darkMode }) => ($darkMode ? "#f9fafb" : "#111827")};
    margin-bottom: 0.25rem;
  }

  .stat-label {
    font-size: 0.75rem;
    color: ${({ $darkMode }) => ($darkMode ? "#9ca3af" : "#6b7280")};
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

// Loading and error states
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: ${({ $darkMode }) => ($darkMode ? "#9ca3af" : "#6b7280")};
`;

const LoadingSpinner = styled.div`
  ${({ $darkMode }) => css`
    width: 40px;
    height: 40px;
    border: 4px solid ${$darkMode ? "#4b5563" : "#e5e7eb"};
    border-top: 4px solid ${$darkMode ? "#a78bfa" : "#8b5cf6"};
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
  `}
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: ${({ $darkMode }) => ($darkMode ? "#f87171" : "#ef4444")};
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
    color: ${({ $darkMode }) => ($darkMode ? "#d1d5db" : "#4b5563")};
  }
`;

// Platform configurations
const PLATFORM_CONFIG = {
  leetcode: {
    color: "#ffa116",
    gradientId: "leetcodeGradient",
    minDomain: 1400,
    name: "LeetCode",
  },
  codeforces: {
    color: "#1f8aed",
    gradientId: "codeforcesGradient",
    minDomain: 800,
    name: "CodeForces",
  },
  codechef: {
    color: "#5b4638",
    gradientId: "codechefGradient",
    minDomain: 1000,
    name: "CodeChef",
  },
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, $darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: $darkMode
            ? "rgba(31, 41, 55, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          padding: "12px 16px",
          border: `1px solid ${$darkMode ? "#4b5563" : "#e5e7eb"}`,
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          fontSize: "14px",
          fontWeight: "600",
          color: $darkMode ? "#f9fafb" : "#374151",
        }}
      >
        <p style={{ margin: 0 }}>Contest {label}</p>
        <p style={{ margin: "4px 0 0", color: payload[0].color }}>
          Rating: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

function ContestRating({ data, forceData, codeData }) {
  const [activeTab, setActiveTab] = useState("leetcode");
  const { toggle } = useToggle();
  const darkMode = toggle === true;

  // Memoized data processing for better performance
  const chartData = useMemo(() => {
    try {
      const safeNumber = (value, fallback = 0) => {
        const num = Number(value);
        return isNaN(num) ? fallback : num;
      };

      const leetcodeRating = [];

      for (let i = 0; i < data.length; i++) {
        leetcodeRating.push(safeNumber(data[i].rating));
      }

      const codechefRating = [];

      for (let i = 0; i < codeData.length; i++) {
        codechefRating.push(safeNumber(codeData[i].rating));
      }

      const codeforcesRating = [];

      for (let i = 0; i < forceData.length; i++) {
        const rating = safeNumber(forceData[i].rating);
        if (rating > 0) {
          codeforcesRating.push(rating);
        }
      }

      console.log(leetcodeRating);
      console.log(codechefRating);
      console.log(codeforcesRating);
      return {
        leetcode: leetcodeRating.map((rating, index) => ({
          contest: index + 1,
          rating,
        })),
        codechef: codechefRating.map((rating, index) => ({
          contest: index + 1,
          rating,
        })),
        codeforces: codeforcesRating.map((rating, index) => ({
          contest: index + 1,
          rating,
        })),
      };
    } catch (error) {
      console.error("Error processing contest data:", error);
      return { leetcode: [], codechef: [], codeforces: [] };
    }
  }, [data, forceData, codeData]);

  // Calculate statistics
  const getStats = (platformData) => {
    if (!platformData || platformData.length === 0) {
      return { current: 0, peak: 0, contests: 0, trend: 0 };
    }

    const ratings = platformData.map((d) => d.rating);
    const current = ratings[ratings.length - 1] || 0;
    const peak = Math.max(...ratings);
    const contests = ratings.length;
    const trend =
      ratings.length > 1 ? current - ratings[ratings.length - 2] : 0;

    return { current, peak, contests, trend };
  };

  const currentStats = getStats(chartData[activeTab]);

  const renderChart = () => {
    const platformData = chartData[activeTab];
    const config = PLATFORM_CONFIG[activeTab];

    if (!platformData || platformData.length === 0) {
      return (
        <ErrorContainer $darkMode={darkMode}>
          <h3>No Contest Data</h3>
          <p>No contest history available for {config.name}</p>
        </ErrorContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={platformData}
          margin={{ top: 20, right: 30, left: 50, bottom: 60 }}
        >
          <defs>
            <linearGradient id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="20%" stopColor={config.color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={config.color} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={
              darkMode ? "rgba(75, 85, 99, 0.5)" : "rgba(209, 213, 219, 0.5)"
            }
          />
          <XAxis
            dataKey="contest"
            stroke={darkMode ? "#9ca3af" : "#6b7280"}
            fontSize={12}
            label={{
              value: "Number of Contests Attended",
              position: "insideBottom",
              offset: -10,
              style: {
                textAnchor: "middle",
                fill: darkMode ? "#9ca3af" : "#6b7280",
                fontSize: "14px",
                fontWeight: "500",
              },
            }}
          />
          <YAxis
            domain={[config.minDomain, "dataMax + 100"]}
            stroke={darkMode ? "#9ca3af" : "#6b7280"}
            fontSize={12}
            label={{
              value: "Contest Rating",
              angle: -90,
              position: "insideLeft",
              style: {
                textAnchor: "middle",
                fill: darkMode ? "#9ca3af" : "#6b7280",
                fontSize: "14px",
                fontWeight: "500",
              },
            }}
          />
          <Tooltip content={<CustomTooltip $darkMode={darkMode} />} />
          <Area
            type="monotone"
            dataKey="rating"
            stroke={config.color}
            strokeWidth={3}
            fill={`url(#${config.gradientId})`}
            dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return (
    <StyledDiv $darkMode={darkMode}>
      <HeaderRow type="horizontal" $darkMode={darkMode}>
        <h2>Contest Rating Progress</h2>
        <ButtonContainer $darkMode={darkMode}>
          {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
            <Button
              key={key}
              variation={activeTab === key ? "primary" : "secondary"}
              size="small"
              className={activeTab === key ? "active" : ""}
              onClick={() => setActiveTab(key)}
            >
              {config.name}
            </Button>
          ))}
        </ButtonContainer>
      </HeaderRow>

      <ChartContainer $darkMode={darkMode}>{renderChart()}</ChartContainer>

      <StatsContainer $darkMode={darkMode}>
        <StatItem $darkMode={darkMode}>
          <div className="stat-value">{currentStats.current}</div>
          <div className="stat-label">Current Rating</div>
        </StatItem>
        <StatItem $darkMode={darkMode}>
          <div className="stat-value">{currentStats.peak}</div>
          <div className="stat-label">Peak Rating</div>
        </StatItem>
        <StatItem $darkMode={darkMode}>
          <div className="stat-value">{currentStats.contests}</div>
          <div className="stat-label">Total Contests</div>
        </StatItem>
        <StatItem $darkMode={darkMode}>
          <div
            className="stat-value"
            style={{
              color: currentStats.trend >= 0 ? "#10b981" : "#ef4444",
            }}
          >
            {currentStats.trend >= 0 ? "+" : ""}
            {currentStats.trend}
          </div>
          <div className="stat-label">Last Change</div>
        </StatItem>
      </StatsContainer>
    </StyledDiv>
  );
}

export default ContestRating;
