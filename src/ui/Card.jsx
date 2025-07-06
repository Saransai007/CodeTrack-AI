import styled from "styled-components";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { SiTicktick } from "react-icons/si";
import { useToggle } from "../ToggleContext";

const StyledCard = styled.div`
  position: relative;
  background: ${(props) =>
    props.$toggle
      ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
      : "linear-gradient(135deg,rgb(242, 243, 245), #f0f9ff)"};

  border: 1px solid
    ${(props) =>
      props.$toggle ? "#374151" /* dark: gray-700 */ : "var(--color-grey-300)"};
  border-radius: 1.2rem;
  padding: 1.6rem;
  margin-bottom: 1.4rem;
  box-shadow: ${(props) =>
    props.$toggle
      ? "0 1px 4px rgba(0, 0, 0, 0.8)" /* dark shadow */
      : "0 1px 4px rgba(0, 0, 0, 0.05)"};

  &:hover {
    box-shadow: ${(props) =>
      props.$toggle
        ? "0 4px 16px rgba(0, 0, 0, 0.6)"
        : "0 4px 16px rgba(0, 0, 0, 0.12)"};
    border-left: 4px solid
      ${(props) => {
        const colorsLight = {
          green: "#3fbf7f",
          orange: "#f97316",
          red: "#ef4444",
        };
        const colorsDark = {
          green: "#22c55e",
          orange: "#fb923c",
          red: "#f87171",
        };
        const colors = props.$toggle ? colorsDark : colorsLight;
        if (props.$type === "green") return colors.green;
        if (props.$type === "orange") return colors.orange;
        if (props.$type === "red") return colors.red;
        return colors.green;
      }};
  }

  &:active {
    opacity: 0.9;
  }
`;

const Heading = styled.h4`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${
    (props) =>
      props.$toggle ? "#d1d5db" /* dark: gray-300 */ : "#111827" /* light */
  };
  margin-bottom: 0.8rem;
  &::before {
    margin-right: 0.4rem;
    content: "•";
    font-size: 1.6rem;
    color: ${(props) => {
      const colorsLight = {
        green: "#3fbf7f",
        orange: "#f97316",
        red: "#ef4444",
      };
      const colorsDark = {
        green: "#22c55e",
        orange: "#fb923c",
        red: "#f87171",
      };
      const colors = props.$toggle ? colorsDark : colorsLight;
      if (props.$type === "green") return colors.green;
      if (props.$type === "orange") return colors.orange;
      if (props.$type === "red") return colors.red;
      return colors.green;
    }};
  }
`;

const Content = styled.p`
  font-size: 1.4rem;
  color: ${
    (props) =>
      props.$toggle ? "#9ca3af" /* dark: gray-400 */ : "#374151" /* light */
  };
  margin-bottom: 1.2rem;
  white-space: pre-wrap;
`;

const EditIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  color: ${
    (props) =>
      props.$toggle
        ? "#9ca3af" /* dark: gray-400 */
        : "#6b7280" /* light gray */
  };

  &:hover {
    color: ${
      (props) =>
        props.$toggle ? "#d1d5db" /* dark: gray-300 */ : "#111827" /* light */
    };
  }
`;

const AvatarGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${(props) => props.$bg || "#c084fc"};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 500;
`;

function Card({ id, title, description, urgent = 0, setActiveCard, descAdd }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDesc, setEditedDesc] = useState(description);
  const { toggle } = useToggle();

  const getUrgencyType = () => {
    switch (urgent) {
      case 0:
        return "green";
      case 1:
        return "orange";
      case 2:
        return "red";
      default:
        return "green";
    }
  };

  return (
    <StyledCard
      $type={getUrgencyType()}
      $toggle={toggle}
      draggable
      onDragStart={() => setActiveCard(id)}
      onDragEnd={() => setActiveCard(null)}
    >
      <EditIcon $toggle={toggle} onClick={() => setIsEditing(!isEditing)}>
        <Pencil size={16} />
      </EditIcon>

      <Heading $type={getUrgencyType()} $toggle={toggle}>
        {title}
      </Heading>

      {isEditing ? (
        <>
          <textarea
            value={editedDesc}
            onChange={(e) => setEditedDesc(e.target.value)}
            style={{
              fontSize: "1.4rem",
              width: "100%",
              padding: "0.6rem",
              borderRadius: "0.8rem",
              border: toggle ? "1px solid #4b5563" : "1px solid #d1d5db", // dark/light border
              resize: "vertical",
              minHeight: "100px",
              marginBottom: "0.6rem",
              fontFamily: "inherit",
              backgroundColor: toggle ? "#374151" : "#fff", // dark/light bg
              color: toggle ? "#d1d5db" : "#111827", // dark/light text
            }}
            autoFocus
          />
          <div
            onClick={() => {
              setIsEditing(false);
              descAdd(id, editedDesc);
            }}
            style={{
              marginLeft: "auto",
              width: "fit-content",
              cursor: "pointer",
              color: toggle ? "#22c55e" : "#3fbf7f",
            }}
          >
            <SiTicktick size={18} />
          </div>
        </>
      ) : (
        <Content $toggle={toggle}>{editedDesc}</Content>
      )}

      <AvatarGroup>
        <Avatar $bg="#6366f1">SS</Avatar>
      </AvatarGroup>
    </StyledCard>
  );
}

export default Card;
