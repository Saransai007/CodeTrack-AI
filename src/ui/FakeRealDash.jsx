import React from "react";
import styled from "styled-components";
import Display from "./Display";

import { TbBrandLeetcode } from "react-icons/tb";
const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3%;
  margin-left: 4%;
  margin-right: 5%;
  height: 12.5%;
`;
function FakeRealDash() {
  return (
    <StyledDiv>
      <Display
        problems={null}
        icon={"SiLeetcode"}
        platform={"LEETCODE"}
        BackGround={"var(--color-yellow-100)"}
        color={"var(--color-yellow-700)"}
      />
      <Display
        problems={null}
        icon={"SiCodechef"}
        platform={"CODECHEF"}
        BackGround={"var(--color-blue-100)"}
        color={"var(--color-blue-700)"}
      />
      <Display
        problems={null}
        icon={"SiCodeforces"}
        platform={"CODEFORCES"}
        BackGround={"var(--color-red-100)"}
        color={"var(--color-red-700)"}
      />
      <Display
        problems={null}
        icon={"Equals"}
        platform={"TOTAL"}
        BackGround={"var(--color-green-100)"}
        color={"var(--color-green-700)"}
      />
    </StyledDiv>
  );
}
export default FakeRealDash;
