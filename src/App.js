import TaskModal from "./components/TaskModal"; // import it
import React, { useState, useEffect } from "react";
import axios from "axios";
import MonthView from "./components/MonthView";
import YearSidebar from "./components/YearSidebar";
import { useTheme } from "./context/ThemeContext";

const API_URL = "https://backend-zos8.onrender.com/api/tasks/";
function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState("");

  const { darkMode, toggleTheme } = useTheme();

  const fetchTasks = () => {
    axios.get(API_URL).then((res) => setTasks(res.data));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openModal = (dateStr) => {
    setModalDate(dateStr);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleAddTask = (dateStr, description) => {
    axios.post(`${API_URL}create/`, { date: dateStr, description }).then(() => {
      fetchTasks();
    });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <YearSidebar selectedDate={selectedDate} onSelectMonth={setSelectedDate} />

      <MonthView
        selectedDate={selectedDate}
        tasks={tasks}
        onAddTask={openModal}
        onTaskUpdate={fetchTasks}
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