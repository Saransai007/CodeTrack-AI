import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideBar from "./Sidebar";
import styled from "styled-components";
import { useToggle } from "../ToggleContext";

const StyledAppLayout = styled.div`
  background-color: ${(props) =>
    props.$toggle ? "#111827" : "var(--color-grey-50)"};
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
  min-height: 100vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;

const MobileOverlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${(props) => (props.$isOpen ? "block" : "none")};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
  }
`;

const MainContent = styled.main`
  @media (max-width: 768px) {
    grid-column: 1;
    transition: transform 0.3s ease;
    transform: ${(props) =>
      props.$mobileNavOpen ? "translateX(0)" : "translateX(0)"};
  }
`;

function AppLayout() {
  const { toggle, handleToggle, mobileNavOpen, handleMobileNavToggle } =
    useToggle();

  return (
    <>
      <StyledAppLayout $toggle={toggle}>
        <Header handleToggle={handleToggle} toggle={toggle} />
        <SideBar />
        <MainContent $mobileNavOpen={mobileNavOpen}>
          <Outlet context={{ toggle, handleToggle }} />
        </MainContent>
      </StyledAppLayout>
      <MobileOverlay $isOpen={mobileNavOpen} onClick={handleMobileNavToggle} />
    </>
  );
}

export default AppLayout;
