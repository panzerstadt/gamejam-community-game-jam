/*
references
----------
1. requestAnimationFrame with useRef: https://css-tricks.com/using-requestanimationframe-with-react-hooks/
2.
*/
import React, { useEffect, useState, useRef } from "react";
import Canvas from "../Canvas";

import styles from "./index.module.css";

import Level from "../Level";
import Bar from "../Blocks/Environment/Bar";
import Character from "../Blocks/Character";
import useControls from "../useControls";

export const remap = (value, low1, high1, low2, high2) => {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
};

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
  hasJumped: false,
  jumpHeight: 50
};

const initWorld = {
  accX: 0,
  accY: -10,
  height: 300,
  width: 800
};

const Game = ({ height = 600, width = 300 }) => {
  const ctrlRef = useRef();
  const charRef = useRef();

  // movement controller, passed to ref
  const controls = useControls();
  useEffect(() => {
    ctrlRef.current = controls;
  }, [controls]);

  useEffect(() => {
    let loop;
    let spd = 2;
    let ground = 20; //TODO: collision

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
            velY: p.jumpHeight, // an impulse
            hasJumped: true
          }));
        } else {
          setChar(p => {
            if (p.velX > 0) {
              //console.log("slowing down", p);
              return { ...p, velX: p.velX - spd };
            } else if (p.velX < 0) {
              return { ...p, velX: p.velX + spd };
            } else if (p.velY > 0) {
              return { ...p, vely: p.velY - spd };
            } else {
              return p;
            }
          });
        }

        // physics events (after character action events)
        // ----------------------------------------------
        // gravity
        if (character.bottom >= ground) {
          // if character is in the air
          setChar(p => ({ ...p, bottom: p.bottom - 2 }));
        } else {
          // collision
          // if character has reached the ground
          setChar(p => ({ ...p, hasJumped: false }));
        }

        // world movements
        // if (character.left > 300) {
        //   setBar1(p => ({ x: p.x - spd, y: p.y }));
        //   setBar2(p => ({ x: p.x - spd, y: p.y }));
        //   setBar3(p => ({ x: p.x - spd, y: p.y }));
        // } else if (character.left < 10) {
        //   setBar1(p => ({ x: p.x + spd, y: p.y }));
        //   setBar2(p => ({ x: p.x + spd, y: p.y }));
        //   setBar3(p => ({ x: p.x + spd, y: p.y }));
        // }
      }

      loop = requestAnimationFrame(gameLoop);
    };
    // game loop
    gameLoop();

    return () => cancelAnimationFrame(loop);
  }, []);
  // only init gameloop once but get fresh state within loop using refs

  const [char, setChar] = useState(initChar);
  useEffect(() => {
    charRef.current = char;
  }, [char]);

  const [world, setWorld] = useState(initWorld);

  const handleGetShapes = shapes => {
    console.log("here are the shapes used for collisions detection", shapes);
  };

  const [count, setCount] = useState(1);
  useEffect(() => {
    if (controls.space) {
      setCount(p => p + 1);
    }
  }, [controls]);

  // the world becomes more unpredictable the higher the person goes
  return (
    <>
      {JSON.stringify(controls)}
      <br />
      <br />
      <div
        className={styles.container}
        style={{ height: world.height, width: world.width }}
      >
        <div className={styles.gameSpace}>
          <Character x={char.left} y={char.bottom} />

          <Level
            seed={count}
            difficulty={count / 5}
            width={world.width}
            height={world.height}
            lie={clamp(
              remap(
                char.jumpHeight + char.height - char.bottom,
                0,
                char.jumpHeight,
                0,
                1
              ),
              0,
              1
            )}
            onShapes={handleGetShapes}
          />
        </div>

        {/* <Canvas className={styles.collision} onContext={handleContext}></Canvas> */}
      </div>
    </>
  );
};

export default Game;
