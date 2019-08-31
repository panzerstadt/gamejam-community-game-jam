import { PhysicsEntity } from "../PhysicsEntity";

const Engine = entities => {
  this.entities = entities;
};

Engine.prototype.step = elapsed => {
  let gx = GRAVITY_X * elapsed;
  let gy = GRAVITY_Y * elapsed;
  let entities = this.entities;

  entities.forEach(entity => {
    switch (entity.type) {
      // moving objects
      case PhysicsEntity.DYNAMIC:
        entity.vx += entity.ax * elapsed + gx;
        entity.vy += entity.ay * elapsed + gy;
        entity.x += entity.vx * elapsed;
        entity.y += entity.vy * elapsed;
        break;
      case PhysicsEntity.KINEMATIC:
        entity.vx += entity.ax * elapsed;
        entity.vy += entity.ay * elapsed;
        entity.x += entity.vx * elapsed;
        entity.y += entity.vy * elapsed;
        break;
    }
  });

  let collisions = this.collider.detectCollisions(
    this.player,
    this.collidables
  );

  if (collosions !== null) {
    this.solver.resolve(this.player, collisions);
  }
};
