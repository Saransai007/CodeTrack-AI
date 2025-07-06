import React from "react";
import styled from "styled-components";

const SidebarContainer = styled.div`
  width: 250px;
  background: white;
  padding: 1rem;

  border-right: 1px solid #ddd;
  overflow-y: hidden;
`;

const Filter = styled.div`
  margin-bottom: 1rem;
  color: #555;
`;

function Side() {
  return (
    <SidebarContainer>
      <h3>Filters</h3>
      <Filter>🔧 Work Orders</Filter>
      <Filter>📦 Move-Ins</Filter>
      <Filter>🚚 Move-Outs</Filter>
      <Filter>📝 Notes</Filter>
    </SidebarContainer>
  );
}

export default Side;
