import React from "react";
import styles from "./index.module.css";

const Bar = ({ width = 100, height = 20, x, y, style, ...rest }) => {
  return (
    <div
      className={styles.container}
      style={{ width: width, height: height, bottom: y, left: x, ...style }}
    ></div>
  );
};

export default Bar;
