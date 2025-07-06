import React from "react";
import styled from "styled-components";
import Display from "./Display";

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(1rem, 3vw, 2rem);
  margin: 0 clamp(1rem, 4vw, 4rem);
  padding: 1rem 0;

  /* Tablet and smaller screens */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin: 0 2rem;
  }

  /* Mobile screens */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 0 1rem;
  }

  /* Large mobile screens - 2 columns */
  @media (min-width: 480px) and (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Small mobile screens - 1 column */
  @media (max-width: 479px) {
    grid-template-columns: 1fr;
  }
`;

function RealDash({ data, codeData, forceData }) {
  return (
    <StyledDiv>
      <Display
        problems={data?.leetcodeSolved || 0}
        icon={"SiLeetcode"}
        platform={"LEETCODE"}
        BackGround={"var(--color-yellow-100)"}
        color={"var(--color-yellow-700)"}
        darkbg={"#854d0e"}
        darkcol={"#fef9c3"}
      />
      <Display
        problems={codeData?.codechefSolved || 0}
        icon={"SiCodechef"}
        platform={"CODECHEF"}
        BackGround={"var(--color-blue-100)"}
        color={"var(--color-blue-700)"}
        darkbg={"#075985"}
        darkcol={"#e0f2fe"}
      />
      <Display
        problems={forceData?.codeforcesSolved || 0}
        icon={"SiCodeforces"}
        platform={"CODEFORCES"}
        BackGround={"var(--color-red-100)"}
        color={"var(--color-red-700)"}
        darkbg={"#b91c1c"}
        darkcol={"#fee2e2"}
      />
      <Display
        problems={
          Number(data?.leetcodeSolved || 0) +
          Number(codeData?.codechefSolved || 0) +
          Number(forceData?.codeforcesSolved || 0)
        }
        icon={"Equals"}
        platform={"TOTAL"}
        BackGround={"var(--color-green-100)"}
        color={"var(--color-green-700)"}
        darkbg={"#166534"}
        darkcol={"#dcfce7"}
      />
    </StyledDiv>
  );
}

export default RealDash;
