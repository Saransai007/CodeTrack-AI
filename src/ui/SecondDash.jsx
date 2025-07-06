import React from "react";
import SecondDisplay from "./SecondDisplay";
import styled from "styled-components";
import SecondaryPie from "./SecondaryPie";

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(1rem, 2vw, 1.5rem);
  padding: clamp(0.75rem, 2vw, 1.25rem);
  margin: 0 auto;
  max-width: 100%;
  width: 95%;
  height: auto;

  /* Remove excessive spacing */
  box-sizing: border-box;

  /* Large desktop screens */
  @media (min-width: 1440px) {
    gap: 1.5rem;
    padding: 1.25rem;
    max-width: 1400px;
  }

  /* Desktop screens */
  @media (max-width: 1200px) {
    gap: 1.25rem;
    padding: 1rem;
  }

  /* Large tablet screens */
  @media (max-width: 1024px) {
    gap: 1rem;
    padding: 0.875rem;
  }

  /* Medium tablet screens */
  @media (max-width: 900px) {
    gap: 0.875rem;
    padding: 0.75rem;
  }

  /* Small tablet screens - switch to single column */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0.75rem;

    /* Ensure components don't have excessive height */
    > * {
      height: auto;
      min-height: auto;
    }
  }

  /* Mobile screens */
  @media (max-width: 640px) {
    gap: 0.875rem;
    padding: 0.625rem;
  }

  /* Small mobile screens */
  @media (max-width: 480px) {
    gap: 0.75rem;
    padding: 0.5rem;
  }

  /* Extra small mobile screens */
  @media (max-width: 360px) {
    gap: 0.625rem;
    padding: 0.375rem;
  }

  /* Ensure components fit properly */
  > * {
    width: 100%;
    height: auto;
    overflow: hidden;
  }

  /* Animation for smooth transitions */
  transition: all 0.3s ease;
`;

// Container wrapper for better overall layout control
const DashboardContainer = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;

  /* Remove any default spacing that might cause gaps */
  * {
    box-sizing: border-box;
  }

  /* Ensure tight layout */
  @media (max-width: 768px) {
    padding: 0;
  }
`;

function SecondDash({
  codeData1,
  data1,
  forceData1,
  data,
  codeData,
  forceData,
}) {
  return (
    <DashboardContainer>
      <StyledDiv>
        <SecondDisplay />
        <SecondaryPie
          codeData1={codeData1}
          data1={data1}
          forceData1={forceData1}
          codeData={codeData}
          data={data}
          forceData={forceData}
        />
      </StyledDiv>
    </DashboardContainer>
  );
}

export default SecondDash;
