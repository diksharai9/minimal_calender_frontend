import TaskModal from "./components/TaskModal";
import React, { useState, useEffect } from "react";
import axios from "axios";
import MonthView from "./components/MonthView";
import YearSidebar from "./components/YearSidebar";
import { useTheme } from "./context/ThemeContext";
import { Navigate } from "react-router-dom";

const API_URL = "https://backend-zos8.onrender.com/api/tasks/";

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState("");
  const [shouldRedirect, setShouldRedirect] = useState(false); // 🆕 State to control redirection

  const { darkMode, toggleTheme } = useTheme();

  const token = localStorage.getItem("token");

  // ✅ Always call useEffect, even if token is missing
  useEffect(() => {
    if (!token) {
      setShouldRedirect(true); // trigger redirect
      return;
    }

    axios
      .get(API_URL, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => setTasks(res.data))
      .catch((err) => {
        console.error("Failed to fetch tasks", err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          setShouldRedirect(true);
        }
      });
  }, [token]);

  if (shouldRedirect) {
    return <Navigate to="/login" replace />;
  }

  const openModal = (dateStr) => {
    setModalDate(dateStr);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleAddTask = (dateStr, description) => {
    axios
      .post(
        `${API_URL}create/`,
        { date: dateStr, description },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then(() => {
        axios
          .get(API_URL, {
            headers: { Authorization: `Token ${token}` },
          })
          .then((res) => setTasks(res.data));
      });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <YearSidebar selectedDate={selectedDate} onSelectMonth={setSelectedDate} />

      <MonthView
        selectedDate={selectedDate}
        tasks={tasks}
        onAddTask={openModal}
        onTaskUpdate={() => {
          axios
            .get(API_URL, {
              headers: { Authorization: `Token ${token}` },
            })
            .then((res) => setTasks(res.data));
        }}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />

      <TaskModal
        show={modalOpen}
        onClose={closeModal}
        onSave={handleAddTask}
        initialDate={modalDate}
      />
    </div>
  );
}

export default App;
