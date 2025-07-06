import React from "react";
import SecondDisplay from "./SecondDisplay";
import styled from "styled-components";
import SecondaryPie from "./SecondaryPie";
import ContestRating from "./ContestRating";

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin: 1.5rem;
  padding-bottom: 2rem;
  min-height: 90vh;
  width: 96%;
  /* Tablet and larger screens */
  @media (min-width: 768px) {
    gap: 2rem;
    margin: 2rem 3rem;
    padding-bottom: 3rem;
  }

  /* Desktop screens */
  @media (min-width: 1024px) {
    gap: 3%;
    margin-left: 4%;
    margin-right: 5%;
    margin-top: 1.5%;
    padding-bottom: 5%;
  }

  /* Large desktop screens */
  @media (min-width: 1440px) {
    max-width: 1400px;
    margin: 1.5% auto 5%;
    padding: 0 2rem 5%;
  }

  /* Ultra-wide screens */
  @media (min-width: 1920px) {
    max-width: 1600px;
  }

  /* Mobile landscape optimization */
  @media (max-width: 767px) and (orientation: landscape) {
    margin: 1rem;
    gap: 1rem;
    min-height: auto;
  }

  /* Small mobile screens */
  @media (max-width: 480px) {
    margin: 0.75rem;
    gap: 1rem;
    padding-bottom: 1.5rem;
  }

  /* Very small screens */
  @media (max-width: 320px) {
    margin: 0.5rem;
    gap: 0.75rem;
  }
`;

function ThirdDash({ codeData, forceData, data }) {
  return (
    <StyledDiv>
      <ContestRating codeData={codeData} forceData={forceData} data={data} />
    </StyledDiv>
  );
}

export default ThirdDash;
