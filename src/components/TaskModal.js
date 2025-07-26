import React, { useState, useEffect, useRef } from "react";
import styles from "./styles/TaskModal.module.css";

const TaskModal = ({ show, onClose, onSave, initialDate }) => {
  const [description, setDescription] = useState("");
  const [taskDate, setTaskDate] = useState(initialDate);
  const modalRef = useRef(null);

  // Update task date if initialDate changes
  useEffect(() => {
    setTaskDate(initialDate);
  }, [initialDate]);

  // Reset input when modal opens
  useEffect(() => {
    if (show) {
      setDescription("");
      const input = modalRef.current?.querySelector("textarea");
      if (input) input.focus();
    }
  }, [show]);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  const handleSubmit = () => {
    if (description.trim()) {
      onSave(taskDate, description);
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div
      className={styles.modalOverlay}
      style={{ opacity: 1, visibility: "visible" }}
    >
      <div ref={modalRef} className={styles.modalContent}>
        <h3 className={styles.modalHeader}>Add Task for {taskDate}</h3>
        <textarea
          className={styles.taskInput}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's on your mind? (e.g., 🏋️‍♀️ Gym, 📚 Read 'Dune')"
          rows="3"
        />
        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={handleSubmit}>
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
