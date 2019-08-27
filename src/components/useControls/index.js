import { useEffect, useState } from "react";

// character move set
const moveSet = {
  up: false,
  down: false,
  left: false,
  right: false,
  dunno: false
};

let fired = false;
const useControls = () => {
  const [controls, setControls] = useState(moveSet);
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleKeyDown = event => {
    if (!fired) {
      fired = true;
      switch (event.key) {
        case "ArrowUp":
          setControls(p => ({ ...p, up: true }));
          break;
        case "ArrowDown":
          setControls(p => ({ ...p, down: true }));
          break;
        case "ArrowLeft":
          setControls(p => ({ ...p, left: true }));
          break;
        case "ArrowRight":
          setControls(p => ({ ...p, right: true }));
          break;
        default:
          setControls(p => ({ ...p, dunno: true }));
          break;
      }
    }
  };

  const handleKeyUp = event => {
    fired = false;
    switch (event.key) {
      case "ArrowUp":
        setControls(p => ({ ...p, up: false }));
        break;
      case "ArrowDown":
        setControls(p => ({ ...p, down: false }));
        break;
      case "ArrowLeft":
        setControls(p => ({ ...p, left: false }));
        break;
      case "ArrowRight":
        setControls(p => ({ ...p, right: false }));
        break;
      default:
        setControls(p => ({ ...p, dunno: false }));
        break;
    }
  };

  return controls;
};

export default useControls;
