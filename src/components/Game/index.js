/*
references
----------
1. requestAnimationFrame with useRef: https://css-tricks.com/using-requestanimationframe-with-react-hooks/
2.
*/
import React, { useEffect, useState, useRef } from "react";
import Canvas from "../Canvas";

import styles from "./index.module.css";

import Bar from "../Blocks/Environment/Bar";
import Character from "../Blocks/Character";
import useControls from "../useControls";

const initChar = {
  width: 50,
  height: 50,
  left: 30,
  get right() {
    return this.left + this.width;
  },
  bottom: 30,
  get top() {
    return this.bottom + this.height;
  },
  velX: 0,
  velY: 0,
  hasJumped: false
};

const Game = ({ height = 600, width = 300 }) => {
  const ctrlRef = useRef();
  const charRef = useRef();

  const handleContext = ctx => {
    // setup canvas
    ctx.height = height;
    ctx.width = width;
  };

  // movement controller, passed to ref
  const controls = useControls();
  useEffect(() => {
    ctrlRef.current = controls;
  }, [controls]);

  useEffect(() => {
    let loop;
    let spd = 2;
    let ground = 0; //TODO: collision

    const gameLoop = time => {
      // do something to the character
      // ref gets fresh controls at every loop

      // get latest character positions
      const character = charRef.current;
      // get latest movements
      const moveset = ctrlRef.current;
      if (character && moveset) {
        // character action events
        // -----------------------
        // handle movements
        if (moveset.right) {
          // left === css "left", not the character left
          setChar(p => ({ ...p, left: p.left + p.velX, velX: spd }));
        } else if (moveset.left) {
          setChar(p => ({ ...p, left: p.left + p.velX, velX: -spd }));
        } else if (moveset.up && !character.hasJumped) {
          setChar(p => ({
            ...p,
            bottom: p.bottom + p.velY,
            velY: 50, // an impulse
            hasJumped: true
          }));
        } else {
          setChar(p => {
            if (p.velX > 0) {
              //console.log("slowing down", p);
              return { ...p, velX: p.velX - 1 };
            } else if (p.velX < 0) {
              return { ...p, velX: p.velX + 1 };
            } else if (p.velY > 0) {
              return { ...p, vely: p.velY - 1 };
            } else {
              return p;
            }
          });
        }

        // physics events (after character action events)
        // ----------------------------------------------
        // gravity
        if (character.bottom >= ground + character.height) {
          // if character is in the air
          setChar(p => ({ ...p, bottom: p.bottom - 2 }));
        } else {
          // collision
          // if character has reached the ground
          setChar(p => ({ ...p, hasJumped: false }));
        }

        // world movements
        if (character.left > 50) {
          setBar1(p => ({ x: p.x - spd, y: p.y }));
          setBar2(p => ({ x: p.x - spd, y: p.y }));
          setBar3(p => ({ x: p.x - spd, y: p.y }));
        } else if (character.left < 10) {
          setBar1(p => ({ x: p.x + spd, y: p.y }));
          setBar2(p => ({ x: p.x + spd, y: p.y }));
          setBar3(p => ({ x: p.x + spd, y: p.y }));
        }
      }

      loop = requestAnimationFrame(gameLoop);
    };
    // game loop
    gameLoop();

    return () => cancelAnimationFrame(loop);
  }, []);
  // only init gameloop once but get fresh state within loop using refs

  const [bar1, setBar1] = useState({ x: 10, y: 20 });
  const [bar2, setBar2] = useState({ x: 250, y: 30 });
  const [bar3, setBar3] = useState({ x: 370, y: 20 });

  const [char, setChar] = useState(initChar);
  useEffect(() => {
    charRef.current = char;
  }, [char]);

  return (
    <>
      {JSON.stringify(controls)}
      <div className={styles.container}>
        <div className={styles.gameSpace}>
          <Character x={char.left} y={char.bottom} />

          <Bar key="bar-1" x={bar1.x} y={bar1.y} />
          <Bar key="bar-2" x={bar2.x} y={bar2.y} />
          <Bar key="bar-3" x={bar3.x} y={bar3.y} />
        </div>

        <Canvas className={styles.collision} onContext={handleContext}></Canvas>
      </div>
    </>
  );
};

export default Game;
