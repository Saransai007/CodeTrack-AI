import Heading from "../ui/Heading";
import Row from "../ui/Row";
import EventData from "../ui/EventData";
import styled from "styled-components";
import MakeCalen from "../ui/MakeCalen";
import { useEffect, useState } from "react";
import { useToggle } from "../ToggleContext";
import { toast, ToastContainer } from "react-toastify";

const StyledDiv = styled.div`
  height: 100vh;
  overflow: hidden;
  padding: 1rem;

  @media (min-width: 768px) {
    height: 91.1vh;
    padding: 0;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    height: 100vh;
  }
`;

const StyledGrid = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: calc(100vh - 120px);

  @media (min-width: 768px) {
    margin-top: 2%;
    margin-left: 3%;
    display: grid;
    grid-template-columns: 65% 31%;
    grid-template-rows: 1fr;
    gap: 2%;
    height: auto;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 60% 35%;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
    height: calc(100vh - 100px);
    margin-top: 0.5rem;
  }
`;

const MobileCalendarContainer = styled.div`
  @media (max-width: 767px) {
    order: 2;
    min-height: 50vh;
  }

  @media (max-width: 480px) {
    min-height: 55vh;
  }
`;

const MobileEventsContainer = styled.div`
  @media (max-width: 767px) {
    order: 1;
    max-height: 40vh;
    overflow-y: auto;
  }

  @media (max-width: 480px) {
    max-height: 35vh;
  }
`;

function Calendar() {
  const today = new Date();

  const [events, setEvents] = useState([]);
  const [todaysEvents, setTodaysEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [contestEvents, setContestEvents] = useState([]);

  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const currentDate = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const { toggle } = useToggle();

  const fullDate = today.toLocaleDateString("default", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Fetch contests from coding platforms
  const fetchContests = async () => {
    try {
      // Mock contest data - replace with actual API calls
      const mockContests = [
        {
          date: "2024-12-25",
          platform: "leetcode",
          title: "Weekly Contest 375",
          time: "08:00",
        },
        {
          date: "2024-12-26",
          platform: "codeforces",
          title: "Educational Round 160",
          time: "14:35",
        },
        {
          date: "2024-12-27",
          platform: "codechef",
          title: "December Long Challenge",
          time: "15:00",
        },
      ];
      setContestEvents(mockContests);
    } catch (err) {
      console.error("Error fetching contests:", err.message);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch events");

        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err.message);
      }
    };

    fetchEvents();
    fetchContests();
  }, []);

  useEffect(() => {
    updateTodaysEvents(events);
  }, [events]);

  useEffect(() => {
    updateSelectedEventsByDate(events);
  }, [selectedDate, selectedMonth, selectedYear, events]);

  const updateTodaysEvents = (eventList) => {
    const todayEvents = eventList.filter((e) => {
      const d = new Date(e.date);
      return (
        d.getDate() === currentDate &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });

    todayEvents.sort((a, b) => a.starttime.localeCompare(b.starttime));
    setTodaysEvents(todayEvents);
  };

  const updateSelectedEventsByDate = (eventList) => {
    const filtered = eventList.filter((e) => {
      const d = new Date(e.date);
      return (
        d.getDate() === selectedDate &&
        d.getMonth() === selectedMonth &&
        d.getFullYear() === selectedYear
      );
    });

    filtered.sort((a, b) => a.starttime.localeCompare(b.starttime));
    setSelectedEvents(filtered);
  };

  const submittingForm = (day, month, year) => {
    setSelectedDate(day);
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const onSubmit = async (data) => {
    console.log("Submitting data:", data);
    const starthr = data.startTime.split(":")[0];
    const startmin = data.startTime.split(":")[1];
    const endhr = data.endTime.split(":")[0];
    const endmin = data.endTime.split(":")[1];
    if (endhr < starthr || (endhr === starthr && endmin <= startmin)) {
      toast.error("Invalid time range. End time must be after start time.");
    } else {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Failed to add event");

        const newEvent = await res.json();
        setEvents((prev) => [...prev, newEvent]);
      } catch (err) {
        console.error("Error posting event:", err.message);
      }
    }
  };

  const onDelete = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete event");

      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      toast.success("Event deleted successfully!");
    } catch (err) {
      console.error("Error deleting event:", err.message);
      toast.error("Failed to delete event");
    }
  };

  return (
    <>
      <ToastContainer />
      <StyledDiv>
        <Row type="horizontal">
          <Heading $toggle={toggle} as="h2">
            {fullDate}
          </Heading>
        </Row>
        <StyledGrid>
          <MobileEventsContainer>
            <EventData
              events={todaysEvents}
              contestEvents={contestEvents}
              onDelete={onDelete}
            />
          </MobileEventsContainer>
          <MobileCalendarContainer>
            <MakeCalen
              onSubmit={onSubmit}
              submittingForm={submittingForm}
              selectedEvents={selectedEvents}
              contestEvents={contestEvents}
              onDelete={onDelete}
            />
          </MobileCalendarContainer>
        </StyledGrid>
      </StyledDiv>
    </>
  );
}

export default Calendar;
