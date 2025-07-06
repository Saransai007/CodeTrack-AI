// PieCharts.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import styled from "styled-components";

const COLORS = ["#f97316", "#eab308", "#84cc16", "#14b8a6"]; // Your chosen palette

const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
  gap: 0.5rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
`;

const ColorDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const ChartWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

function PieCharts({ chartdata }) {
  return (
    <ChartWrapper>
      <PieChart width={250} height={280}>
        <Pie
          data={chartdata}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={100}
          outerRadius={120}
          paddingAngle={5}
        >
          {chartdata.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value} points`, name]}
          contentStyle={{ fontSize: "14px", fontFamily: "Poppins" }}
        />
      </PieChart>

      <LegendContainer>
        {chartdata.map((entry, index) => (
          <LegendItem key={index}>
            <ColorDot color={COLORS[index % COLORS.length]} />
            <span>{entry.name}</span>
          </LegendItem>
        ))}
      </LegendContainer>
    </ChartWrapper>
  );
}

export default PieCharts;
