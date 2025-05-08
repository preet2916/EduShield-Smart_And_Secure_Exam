import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const MAX_ATTEMPTS = 2;

const TabSwitchBlocker = ({ handleViolation }) => {
  const [violationCount, setViolationCount] = useState(0);
  const [lastSwitchTime, setLastSwitchTime] = useState(0);

  useEffect(() => {
    const registerViolation = (message) => {
      setViolationCount((prev) => {
        const newCount = prev + 1;
        const remaining = MAX_ATTEMPTS - newCount;

        if (remaining > 0) {
          Swal.fire({
            title: "⚠️ Warning!",
            text: `${message}\nYou have ${remaining} warning(s) left!`,
            icon: "warning",
            timer: 3000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            title: "❌ Disqualified!",
            text: "You have switched tabs or minimized the window too many times. The quiz will be submitted automatically.",
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

    const handleTabSwitch = () => {
      const currentTime = Date.now();
      if (currentTime - lastSwitchTime < 1000) return;

      setLastSwitchTime(currentTime);
      registerViolation("Switching tabs or minimizing is not allowed!");
    };

    const handleVisibilityChange = () => {
      if (document.hidden) handleTabSwitch();
    };

    const handleBlur = () => {
      handleTabSwitch();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [lastSwitchTime, handleViolation]);

  return null;
};

export default TabSwitchBlocker;
