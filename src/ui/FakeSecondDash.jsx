import React from "react";
import SecondDisplay from "./SecondDisplay";
import styled from "styled-components";
import SecondaryPie from "./SecondaryPie";
const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3%;
  margin-left: 4%;
  margin-right: 5%;
  margin-top: 3%;
  height: 33%;
`;
function FakeSecondDash() {
  const dummyData1 = {
    submitStats: {
      acSubmissionNum: [{ count: 0 }],
    },
  };

  const dummyData = {
    userContestRanking: {
      rating: 1400,
    },
  };

  const dummyCodeData1 = {
    problemsSolved: "0",
  };

  const dummyCodeData = {
    currentRating: 1000,
  };

  const dummyForceData1 = {
    solvedCount: 0,
  };

  const dummyForceData = {
    result: [{ rating: 800 }],
  };

  return (
    <StyledDiv>
      <SecondDisplay />
      <SecondaryPie
        codeData1={dummyCodeData1}
        data1={dummyData1}
        forceData1={dummyForceData1}
        codeData={dummyCodeData}
        data={dummyData}
        forceData={dummyForceData}
      />
    </StyledDiv>
  );
}

export default FakeSecondDash;
