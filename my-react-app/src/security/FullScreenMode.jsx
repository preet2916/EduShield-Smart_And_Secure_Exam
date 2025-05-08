import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const FullScreenMode = () => {
  const navigate = useNavigate();
  const [exitCount, setExitCount] = useState(0);
  const exitLimit = 5; 

  const enterFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  const handleFullScreenChange = () => {
    if (!document.fullscreenElement) {
      setExitCount((prev) => prev + 1);
      if (exitCount + 1 >= exitLimit) {
        Swal.fire({
          title: "Disqualified!",
          text: "You exited fullscreen too many times. Redirecting to start screen...",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        }).then(() => {
          navigate("/start-screen");
        });
      } else {
        Swal.fire({
          title: "Fullscreen Required",
          text: `You must stay in fullscreen mode! (${exitLimit - exitCount - 1} exits left)`,
          icon: "warning",
          confirmButtonText: "Re-enter Fullscreen",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        }).then(() => {
          enterFullScreen();
        });
      }
    }
  };

  useEffect(() => {
    enterFullScreen(); 
    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, [exitCount]);

  return null; 
};

export default FullScreenMode;
