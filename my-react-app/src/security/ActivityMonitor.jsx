import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";

const MAX_ATTEMPTS = 2;
const DEBOUNCE_TIME = 1000; // 1 second debounce

const ActivityMonitor = ({ handleViolation }) => {
  const [violationCount, setViolationCount] = useState(0);
  const lastViolationTimeRef = useRef(0);

  useEffect(() => {
    document.body.style.userSelect = "none";

    const registerViolation = (message) => {
      const now = Date.now();
      if (now - lastViolationTimeRef.current < DEBOUNCE_TIME) return;

      lastViolationTimeRef.current = now;

      setViolationCount((prev) => {
        const newCount = prev + 1;
        const remaining = MAX_ATTEMPTS - newCount;

        if (remaining > 0) {
          Swal.fire({
            title: "⚠️ Warning!",
            text: `${message}\nYou have ${remaining} attempt(s) left before auto-submission.`,
            icon: "warning",
            timer: 3000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            title: "❌ Disqualified!",
            text: "Too many violations! The quiz will be submitted automatically.",
            icon: "error",
            allowOutsideClick: false,
            confirmButtonText: "OK",
          }).then(() => {
            handleViolation();
          });
        }

        return newCount;
      });
    };

    const blockClipboardActions = (event) => {
      event.preventDefault();
      registerViolation(`"${event.type}" action is not allowed!`);
    };

    document.addEventListener("copy", blockClipboardActions);
    document.addEventListener("cut", blockClipboardActions);
    document.addEventListener("paste", blockClipboardActions);

    return () => {
      document.body.style.userSelect = "auto";
      document.removeEventListener("copy", blockClipboardActions);
      document.removeEventListener("cut", blockClipboardActions);
      document.removeEventListener("paste", blockClipboardActions);
    };
  }, [handleViolation]);

  return null;
};

export default ActivityMonitor;
