import styled from "styled-components";
import { IoMdExit } from "react-icons/io";
import { useState } from "react";
import { MdOutlineDarkMode } from "react-icons/md";
import { HiOutlineBars3 } from "react-icons/hi2";
import { useToggle } from "../ToggleContext";
import { useNavigate } from "react-router-dom";

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1.2%;
  background-color: ${(props) =>
    props.$toggle ? "#18212f" : "var(--color-grey-50)"};
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  color: ${(props) => (props.$toggle ? "white" : "#374151")};

  @media (max-width: 768px) {
    padding: 1.2rem 2rem;
    justify-content: space-between;
  }
`;

const LeftSection = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const MobileNavToggle = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    width: 2.4rem;
    height: 2.4rem;
    color: ${(props) => (props.$toggle ? "white" : "var(--color-grey-600)")};
  }
`;

const StyledImg = styled.img`
  height: 4rem;
  width: 4rem;

  @media (max-width: 768px) {
    height: 3.5rem;
    width: 3.5rem;
  }

  @media (max-width: 480px) {
    height: 3rem;
    width: 3rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.3rem;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const UserText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  p {
    margin: 0;
    font-size: 1.4rem;

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }

  h4 {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 600;

    @media (max-width: 768px) {
      font-size: 1.4rem;
    }
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.4rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.$toggle ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"};
  }

  @media (max-width: 768px) {
    padding: 0.4rem;
  }
`;

const DarkModeIcon = styled(MdOutlineDarkMode)`
  font-size: 24px;
  color: ${(props) => (props.$toggle ? "white" : "#374151")};

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const ExitIcon = styled(IoMdExit)`
  color: red;
  font-size: 24px;

  &:hover {
    color: darkred;
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

function Header() {
  const { toggle, handleToggle, handleMobileNavToggle } = useToggle();
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const Logout = () => {
    localStorage.removeItem("token"); // Remove token
    navigate("/login"); // Redirect to login page
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Profile data:", data);
      setUsername(data.username);
      return data;
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  fetchProfile();

  return (
    <div>
      <StyledHeader $toggle={toggle}>
        <LeftSection>
          <MobileNavToggle
            $toggle={toggle}
            onClick={handleMobileNavToggle}
            aria-label="Toggle navigation menu"
          >
            <HiOutlineBars3 />
          </MobileNavToggle>
        </LeftSection>

        <RightSection>
          <StyledImg src="/public/default-user.jpg" alt="User profile" />
          <UserInfo>
            <UserText>
              <p>Hello,</p>
              <h4>{username}</h4>
            </UserText>
          </UserInfo>
          <IconButton
            $toggle={toggle}
            onClick={handleToggle}
            aria-label="Toggle dark mode"
          >
            <DarkModeIcon $toggle={toggle} />
          </IconButton>
          <IconButton $toggle={toggle} onClick={Logout} aria-label="Logout">
            <ExitIcon />
          </IconButton>
        </RightSection>
      </StyledHeader>
    </div>
  );
}

export default Header;
