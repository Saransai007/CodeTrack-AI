import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { HiOutlineHome } from "react-icons/hi2";
import { FiCalendar } from "react-icons/fi";
import { FaListUl } from "react-icons/fa";
import { BsRobot } from "react-icons/bs";
import { RiProgress5Line } from "react-icons/ri";
import { useToggle } from "../ToggleContext";

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  color: ${(props) => (props.$toggle ? "white" : "#374151")};

  @media (max-width: 768px) {
    margin-top: 2rem;
  }
`;

const StyledNavLink = styled(NavLink)`
  /* Base styles for all links */
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    color: ${(props) => (props.$toggle ? "white" : "var(--color-grey-600)")};
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
    text-decoration: none;
  }

  /* Hover/active states */
  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: ${(props) => (props.$toggle ? "#f3f4f6" : "var(--color-grey-800)")};
    background-color: ${(props) =>
      props.$toggle ? "#111827" : "var(--color-grey-50)"};
    border-radius: var(--border-radius-sm);
  }

  /* Icon styles */
  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }

  /* Small type styles */
  ${(props) =>
    props.$type === "small" &&
    `
      &:link,
      &:visited {
        padding: 0.6rem 1.2rem;
        font-size: 1rem;
        font-weight: 350;
        width: 60%;
        margin-left: 3.1rem;
        align-self: flex-end;
      }
      
      @media (max-width: 768px) {
        &:link,
        &:visited {
          font-size: 1.4rem;
          padding: 1rem 1.5rem;
          width: 80%;
          margin-left: 2rem;
        }
      }
    `}

  ${(props) =>
    props.$active &&
    `
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
     
    & svg {
      color: var(--color-brand-600);
    }
  `}
  
  @media (max-width: 768px) {
    &:link,
    &:visited {
      padding: 1.5rem 2rem;
      font-size: 1.6rem;
    }

    & svg {
      width: 2.2rem;
      height: 2.2rem;
    }
  }
`;

function MainNav() {
  const { toggle, handleMobileNavToggle } = useToggle();

  const handleNavClick = () => {
    // Close mobile nav when a link is clicked
    if (window.innerWidth <= 768) {
      handleMobileNavToggle();
    }
  };

  return (
    <nav>
      <NavList $toggle={toggle}>
        <li>
          <StyledNavLink
            to="/dashboard"
            $toggle={toggle}
            onClick={handleNavClick}
          >
            <HiOutlineHome />
            <span>Home</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink
            to="/calendar"
            $toggle={toggle}
            onClick={handleNavClick}
          >
            <FiCalendar />
            <span>Calendar</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/ToDo" $toggle={toggle} onClick={handleNavClick}>
            <FaListUl />
            <span>To-Do</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/chat" $toggle={toggle} onClick={handleNavClick}>
            <BsRobot />
            <span>Chat with AI</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink
            to="/compiler"
            $toggle={toggle}
            onClick={handleNavClick}
          >
            <BsRobot />
            <span>Compiler</span>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  );
}

export default MainNav;
