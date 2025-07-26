import React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import axios from "axios";
import styles from "./styles/MonthView.module.css";

// Add darkMode and toggleTheme to props
const MonthView = ({ selectedDate, tasks, onAddTask, onTaskUpdate, darkMode, toggleTheme }) => {
  const startOfMonthDate = startOfMonth(selectedDate);
  const endOfMonthDate = endOfMonth(selectedDate);

  const days = eachDayOfInterval({
    start: startOfMonthDate,
    end: endOfMonthDate,
  });

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const tasksByDate = {};
  tasks.forEach((t) => {
    tasksByDate[t.date] = tasksByDate[t.date] || [];
    tasksByDate[t.date].push(t);
  });

  const handleToggleTask = (taskId, currentStatus) => {
    axios
      .patch(`http://localhost:8000/api/tasks/${taskId}/update/`, {
        completed: !currentStatus,
      })
      .then(() => onTaskUpdate())
      .catch((error) => console.error("Error toggling task:", error));
  };

  const handleAddTaskForAllDays = () => {
    const description = prompt("Enter task for all days:");
    if (!description) return;

    const requests = days.map((day) =>
      axios.post("http://localhost:8000/api/tasks/create/", {
        date: format(day, "yyyy-MM-dd"),
        description,
      })
    );

    Promise.all(requests)
      .then(() => onTaskUpdate())
      .catch((error) => console.error("Error adding tasks for all days:", error));
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>{format(selectedDate, "MMMM yyyy")}</h2>
        <button className={styles.addMonthButton} onClick={handleAddTaskForAllDays}>
          +
        </button>
        {/* Theme Toggle Button - Integrated into headerRow */}
        <button
          onClick={toggleTheme}
          className={styles.themeToggleButton} // Add a class for styling
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className={styles.calendarGrid}>
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayTasks = tasksByDate[dateStr] || [];
          const allDone = dayTasks.length > 0 && dayTasks.every((t) => t.completed);
          const hasTasks = dayTasks.length > 0;
          const isToday = dateStr === todayStr;

          const backgroundColor = hasTasks
            ? allDone
              ? "var(--task-complete)" // Use theme variable
              : "var(--card)" // Use theme variable
            : "var(--card)"; // Use theme variable

          const dayBoxClass = `${styles.dayBox} ${isToday ? styles.dayBoxToday : ""} ${
            allDone && hasTasks ? styles.dayBoxCompleted : ""
          }`;

         return (
      <div
        key={dateStr}
        onDoubleClick={() => {
          const isPast = new Date(dateStr) < new Date(todayStr);
          if (!isPast) {
            onAddTask(dateStr);
          } else {
            alert("Cannot add tasks for past dates.");
          }
        }}
        className={dayBoxClass}
        style={{ backgroundColor }}
      >
        <div className={styles.dateWatermark}>{format(day, "d")}</div>
        <div className={styles.dayOfWeekMobile}>{format(day, "EEE")}</div>
        <div className={styles.taskList}>
          {dayTasks.map((t) => (
            <div
              key={t.id}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleTask(t.id, t.completed);
              }}
              className={`${styles.task} ${
                t.completed ? styles.taskCompleted : styles.taskPending
              }`}
            >
              {t.description}
            </div>
      ))}
    </div>
  </div>
);
})}
      </div>
    </div>
  );
};

export default MonthView;