import React, { useState } from "react";
import { format, setMonth } from "date-fns";
import styles from "./styles/YearSidebar.module.css";

const YearSidebar = ({ selectedDate, onSelectMonth }) => {
  const [collapsed, setCollapsed] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) =>
    setMonth(new Date(selectedDate.getFullYear(), 0, 1), i)
  );

  const handleToggle = () => setCollapsed(!collapsed);

  return (
    <div
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
      onClick={handleToggle}
    >
      {collapsed ? (
        <div className={styles.collapsedLabel}>
          {selectedDate.getFullYear()}
        </div>
      ) : (
        <>
          <h3 className={styles.yearLabel}>{selectedDate.getFullYear()}</h3>
          <div className={styles.monthList}>
            {months.map((month) => (
              <button
                key={month}
                onClick={(e) => {
                  e.stopPropagation(); // prevent collapsing on button click
                  onSelectMonth(month);
                }}
                className={`${styles.monthButton} ${
                  format(month, "MMM yyyy") === format(selectedDate, "MMM yyyy")
                    ? styles.selectedMonth
                    : ""
                }`}
              >
                {format(month, "MMMM")}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default YearSidebar;
