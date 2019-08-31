import React, { useEffect, useState } from "react";

import styles from "./index.module.css";

import Bar from "../Blocks/Environment/Bar";
import useLevelGenerator from "./libs/generator";
import { random } from "node-forge";

const calculateTotalPlatformWidth = (gaps, gameWidth) => {
  return gameWidth - gaps.reduce((acc, val) => acc + val);
};

const leftPos = (index, platformWidth, gapList) => {
  if (index === 0) {
    return 0; // first platform
  } else {
    // gapList is always one length less than platforms list
    const gap = gapList[index - 1];
    const widthSoFar =
      index * platformWidth +
      gapList.slice(0, index).reduce((acc, val) => acc + val);
    return gap + widthSoFar;
  }
};

const Level = ({ width, height, seed, difficulty, onShapes, lie }) => {
  // possibly seeded by 10 seconds, in order to allow repeat tries
  const { heights, gaps } = useLevelGenerator(seed, width, height, difficulty);

  const [levelBlocks, setLevelBlocks] = useState([]);
  useEffect(() => {
    const platforms = heights.map((height, i) => {
      const w = calculateTotalPlatformWidth(gaps, width) / heights.length;
      const x = leftPos(i, w, gaps);
      const y = height;

      return {
        width: w,
        x: x,
        y: y
      };
    });

    setLevelBlocks(platforms);
    onShapes && onShapes(platforms);
    // console.log(heights);
    // console.log(gaps);
    // console.log(calculateTotalPlatformWidth(gaps, width));
  }, [heights.toString(), gaps.toString()]);

  //console.log(lie);

  return (
    <div className={styles.container} style={{ width: width, height: height }}>
      {levelBlocks.map((v, i) => {
        const r = new Math.seedrandom(v.width + i)();
        return (
          <Bar
            key={`platform-${JSON.stringify(v)}-${i}`}
            style={{
              transform: `translate(${lie * (r - 0.5) * 60}px, ${lie *
                (r - 0.5) *
                60}px)`,
              opacity: 1 - lie + 0.2
            }}
            width={v.width}
            x={v.x}
            y={v.y}
          />
        );
      })}
    </div>
  );
};

export default Level;
