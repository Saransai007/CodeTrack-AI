import React from "react";
import SecondDisplay from "./SecondDisplay";
import styled from "styled-components";
import SecondaryPie from "./SecondaryPie";
import ContestRating from "./ContestRating";

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 3%;
  margin-left: 4%;
  margin-right: 5%;
  margin-top: 1.5%;
  height: 33%;
  padding-bottom: 5%;
`;
function FakeThreeDash() {
  // Dummy data for LeetCode
  const data = {
    userContestRankingHistory: [
      { attended: true, rating: 0 },
      { attended: true, rating: 0 },
      { attended: true, rating: 0 },
      { attended: true, rating: 0 },
      { attended: true, rating: 0 },
    ],
  };

  // Dummy data for Codeforces
  const forceData = {
    result: [
      { newRating: 0 },
      { newRating: 0 },
      { newRating: 0 },
      { newRating: 0 },
      { newRating: 0 },
    ],
  };

  // Dummy data for CodeChef
  const codeData = {
    ratingData: [
      { rating: 0 },
      { rating: 0 },
      { rating: 0 },
      { rating: 0 },
      { rating: 0 },
    ],
  };

  return (
    <StyledDiv>
      <ContestRating codeData={codeData} forceData={forceData} data={data} />
    </StyledDiv>
  );
}
export default FakeThreeDash;
