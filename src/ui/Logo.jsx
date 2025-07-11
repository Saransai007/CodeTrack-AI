import styled from "styled-components";

const StyledLogo = styled.div`
  text-align: center;
  padding-bottom: 2rem;
`;

const Img = styled.img`
  height: 9.6rem;
  width: auto;
`;

function Logo() {
  return (
    <StyledLogo>
      <Img src="./public/fake.png" alt="Logo" />
    </StyledLogo>
  );
}

export default Logo;
