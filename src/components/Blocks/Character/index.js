import React from "react";

import styles from "./index.module.css";

const Character = ({ x, y }) => {
  return (
    <div className={styles.character} style={{ bottom: y, left: x }}></div>
  );
};

export default Character;
