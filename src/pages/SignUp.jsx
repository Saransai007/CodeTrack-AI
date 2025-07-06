import React from "react";
import styled from "styled-components";
import {
  FaGoogle,
  FaApple,
  FaFacebookF,
  FaEyeSlash,
  FaGlobe,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  background-color: #f5f6fa;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px;
  overflow: hidden;
`;

const CardTop = styled.div`
  background: linear-gradient(to bottom, var(--color-brand-100), #ffffff);
  padding: 2rem 2rem 1rem;
  text-align: center;
`;

const LogoContainer = styled.div`
  background: white;
  border-radius: 1rem;
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 1px #eee, 0 5px 10px rgba(0, 0, 0, 0.05);
`;

const Content = styled.div`
  padding: 0 2rem 2rem;
  text-align: center;
`;

const IconRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
`;

const IconButton = styled.button`
  flex: 1;
  margin: 0 0.3rem;
  padding: 0.6rem 0;
  border: 1px solid #dcdcdc;
  border-radius: 0.75rem;
  background: white;
  cursor: pointer;
  font-size: 1.1rem;
`;

const Divider = styled.div`
  margin: 1.2rem 0;
  color: #999;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  height: 4rem;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 0.75rem;
  font-size: 1.2rem;
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const EyeIcon = styled(FaEyeSlash)`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  cursor: pointer;
`;

const OptionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  margin: 0.5rem 0;
`;
const SignInButton = styled.button`
  position: relative;
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(to right, #5f72be, #9921e8); /* base */
  color: white;
  font-size: 1.3rem;
  border: none;
  border-radius: 0.75rem;
  margin-top: 1rem;
  cursor: pointer;
  z-index: 10;
  overflow: hidden;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, #6a11cb, #2575fc); /* hover */
    opacity: 0;
    z-index: -1;
    border-radius: 0.75rem;
    transition: opacity 0.4s ease;
  }

  &:hover:after {
    opacity: 1;
  }
`;

const FooterText = styled.div`
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #555;
  font-size: 1.2rem;
  a {
    color: #8a63f3;
    text-decoration: none;
    margin-left: 0.3rem;
  }
`;
const StyledAnchor = styled.a`
  font-size: 1.2rem;
`;
const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledP = styled.p`
  margin-left: 5px;
  font-size: 1.2rem;
`;

function SignUp() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPass, setShowPass] = React.useState(true);
  const [showConPass, setShowConPass] = React.useState(true);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          username,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Signup successful!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <Container>
      <ToastContainer />
      <Card>
        <CardTop>
          <LogoContainer>CT</LogoContainer>
          <h3>Welcome back</h3>
          <StyledP>Please enter your details to sign in</StyledP>
        </CardTop>

        <Content>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Enter your username"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Enter your email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordWrapper>
              <Input
                type={showPass ? "password" : "text"}
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <EyeIcon onClick={() => setShowPass(!showPass)} />
            </PasswordWrapper>
            <PasswordWrapper>
              <Input
                type={showConPass ? "password" : "text"}
                placeholder="Re-enter Password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <EyeIcon onClick={() => setShowConPass(!showConPass)} />
            </PasswordWrapper>

            <OptionsRow>
              <label>
                <StyledDiv>
                  <input type="checkbox" />{" "}
                  <StyledP>Remember for 30 days</StyledP>
                </StyledDiv>
              </label>
              <StyledAnchor href="#">Forgot password?</StyledAnchor>
            </OptionsRow>

            <SignInButton type="submit">Sign up</SignInButton>
          </form>

          <FooterText>
            Do you have an account?
            <a href="#">Sign in</a>
          </FooterText>
        </Content>
      </Card>
    </Container>
  );
}

export default SignUp;
