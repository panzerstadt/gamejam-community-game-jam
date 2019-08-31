// a physics entity is an object with state, storing all its relevant data
// has positional data, defining how its allowed to move in space
// has no mass

const Collision = {
  // Elastic collisions refer to the simple cast where
  // two entities collide and a transfer of energy is
  // performed to calculate the resulting speed
  // We will follow Box2D's example of using
  // restitution to represent "bounciness"
  elastic: restitution => {
    this.restitution = restitution || 0.2; // restitution ~= bounceback
  },
  displace: () => {
    // While not supported in this engine
    // the displacement collisions could include
    // friction to slow down entities as they slide
    // across the colliding entity
  }
};

// physics entity will have a shape, collision and type
export const PhysicsEntity = (collisionName, type) => {
  this.type = type || PhysicsEntity.DYNAMIC; // collision detector handling setting
  this.collision = collisionName || PhysicsEntity.ELASTIC; // type of collision received
  this.width = 20;
  this.height = 20;
  this.halfWidth = this.width * 0.5; // half size for quicker calculations
  this.halfHeight = this.height * 0.5;

  const collision = Collision(this.collision);
  collision.call(this);

  // 2d position data
  this.x = 0;
  this.y = 0;
  // velocity
  this.vx = 0;
  this.vy = 0;
  // acceleration
  this.ax = 0;
  this.ay = 0;

  // update object bounds to recalculate
  // half sizes and any other pieces
  this.updateBounds();
};

PhysicsEntity.prototype = {
  // update bounds includes rect boundary updates
  updateBounds: () => {
    this.halfWidth = this.width * 0.5;
    this.halfHeight = this.height * 0.5;
  },
  // getters for the mid point of rect
  getMidX: () => this.halfWidth + this.x,
  getMidY: () => this.halfHeight + this.y,
  // getters for top left right bottom of rect
  getTop: () => this.y,
  getLeft: () => this.x,
  getRight: () => this.x + this.width,
  getBottom: () => this.y + this.height
};

// Constants

// kinematic (static) objects are not affected by gravity (e.g. platforms)
PhysicsEntity.KINEMATIC = "kinematic";

// dynamic objects are affected by physics system
PhysicsEntity.DYNAMIC = "dynamic";

// Solver Constants
// different methods that the solver will take to resolve collisions

// displace will resolve by:
// 1. moving an entity outside of the space of the other
// 2. zero the velocity in that direction
PhysicsEntity.DISPLACE = "displace";

// elastic will displace + bounce the colliding entity off by:
// 1. reducing the velocity by its restitution (bounceback) coefficient
PhysicsEntity.ELASTIC = "elastic";
