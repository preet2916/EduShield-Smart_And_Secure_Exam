import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";

const MAX_ATTEMPTS = 2;
const DEBOUNCE_TIME = 1000; // 1 second

const RightClickBlocker = ({ handleViolation }) => {
  const [violationCount, setViolationCount] = useState(0);
  const lastViolationTimeRef = useRef(0);

  useEffect(() => {
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

    const disableRightClick = (event) => {
      event.preventDefault();
      registerViolation("Right-click is disabled!");
    };

    const disableDevToolsShortcuts = (event) => {
      if (
        event.key === "F12" ||
        (event.ctrlKey && event.shiftKey && ["I", "J", "C"].includes(event.key)) ||
        (event.ctrlKey && event.key === "U")
      ) {
        event.preventDefault();
        registerViolation("Developer tools are not allowed!");
      }
    };

    const detectDevTools = () => {
      console.log("%c", "font-size:1px; line-height:1px; padding:100px 100px; background:red;");
      const before = performance.now();
      debugger;
      const after = performance.now();
      if (after - before > 10) {
        registerViolation("DevTools detected! Please close it.");
      }
    };

    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("keydown", disableDevToolsShortcuts);
    const devToolsInterval = setInterval(detectDevTools, 1000);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keydown", disableDevToolsShortcuts);
      clearInterval(devToolsInterval);
    };
  }, [handleViolation]); // dependency added for latest handler

  return null;
};

export default RightClickBlocker;
