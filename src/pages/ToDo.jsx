import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import ToDoing from "../ui/ToDoing";
import { useToggle } from "../ToggleContext";
const StyleduDiv = styled.div`
  height: 87vh;
`;
const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3%;
  margin-left: 4%;
  margin-right: 5%;
  height: 75vh;
`;

export default function ToDo() {
  const [tasks, setTasks] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const { toggle } = useToggle();
  console.log("Toggle class:", toggle);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setTasks)
      .catch(() => setTasks([]));
  }, []);

  // Add new task
  const handleAddTask = async ({ task, urgency }) => {
    const token = localStorage.getItem("token");
    const body = {
      title: task,
      description: "",
      urgent: Number(urgency),
      status: "todo",
    };
    const res = await fetch("http://localhost:8000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const created = await res.json();
    setTasks((prev) => [...prev, created]);
  };

  // Update description
  const descAdd = async (id, desc) => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/tasks/desc", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, desc }),
    });
    const updated = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const onDrop = async (status, position) => {
    if (activeCard == null) return;

    // 1. Extract moving card and rest
    const moving = tasks.find((t) => t.id === activeCard);
    const rest = tasks.filter((t) => t.id !== activeCard);

    // 2. Partition by status
    const same = rest.filter((t) => t.status === status);
    const other = rest.filter((t) => t.status !== status);

    // 3. Compute insertion index
    const idx = Math.min(position, same.length);

    // 4. Insert at new index
    const updatedSame = [
      ...same.slice(0, idx),
      { ...moving, status },
      ...same.slice(idx),
    ];

    // 5. Re-index positions
    const rePosed = updatedSame.map((t, i) => ({ ...t, position: i }));

    // 6. Merge and update state
    const newTasks = [...other, ...rePosed];
    setTasks(newTasks);
    setActiveCard(null);

    // 7. Persist changes
    const token = localStorage.getItem("token");
    await Promise.all(
      rePosed.map((t) =>
        fetch(`http://localhost:8000/api/tasks/${t.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: t.status, position: t.position }),
        })
      )
    );
  };

  return (
    <StyleduDiv>
      <Row type="horizontal">
        <Heading $toggle={toggle} as="h1">
          To-Do List
        </Heading>
      </Row>
      <StyledDiv>
        {[
          { status: "todo", title: "ToDo" },
          { status: "progress", title: "Progress" },
          { status: "completed", title: "Completed" },
        ].map(({ status, title }) => (
          <ToDoing
            key={status}
            headings={title}
            data={tasks
              .filter((t) => t.status === status)
              .sort((a, b) => a.position - b.position)}
            onAddTask={status === "todo" ? handleAddTask : undefined}
            setActiveCard={setActiveCard}
            status={status}
            onDrop={onDrop}
            descAdd={descAdd}
          />
        ))}
      </StyledDiv>
    </StyleduDiv>
  );
}
