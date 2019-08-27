import React, { useRef, useEffect } from "react";

const Canvas = ({ onContext, children, ...rest }) => {
  const ref = useRef();

  useEffect(() => {
    if (ref) {
      const canvas = ref.current;
      const context = canvas.getContext("2d");
      onContext && onContext(context);
    }
  }, [ref]);

  return <canvas ref={ref} {...rest}></canvas>;
};

export default Canvas;
