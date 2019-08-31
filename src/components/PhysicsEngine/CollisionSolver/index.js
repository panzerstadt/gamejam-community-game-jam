// TLDR: finds out where the collider and collidee's new (uncollided):
// 1. positions and
// 2. directions are

// resolves for when player collides with entity from:
// 1. corner edges
// 2. all 4 sides

const resolveElastic = (player, entity) => {
  // find midpoints of entity and player
  let playerMidX = player.getMidX();
  let playerMidY = player.getMidY();
  let entityMidX = entity.getMidX();
  let entityMidY = entity.getMidY();

  // find side of entry by
  // calculating based on normalized sides
  let dx = (entityMidX - playerMidX) / entity.halfWidth;
  let dy = (entityMidY - playerMidY) / entity.halfHeight;

  // calculate absolute change in x and y
  let absDX = abs(dx);
  let absDY = abs(dy);

  // if distance between normalized x and y pos
  // is less than a small threshold (.1 in this case)
  // then this object is approaching from a corner
  const THRESHOLD = 0.1;
  const STICKY_THRESHOLD = 0.0004;
  // CORNER RESOLUTION
  if (abs(absDX - absDY) < THRESHOLD) {
    // if player is approaching from positiveX
    if (dx < 0) {
      // set player x to right side
      player.x = entity.getRight();

      // if the player is approaching from negative x
    } else {
      // set player x to the left side
      player.x = entity.getLeft() - player.width;
    }

    // if player is approaching from positiveY
    if (dy < 0) {
      // set player y to bottom
      player.y = entity.getBottom();

      // if player is approaching from negative y
    } else {
      // set player y to top
      player.y = entity.getTop() - player.height;
    }

    // randomly select a x/y direction to reflect velocity on
    // TODO: huh!?
    if (Math.random() < 0.5) {
      // reflect velocity at a reduced rate
      player.vx = -player.vx * entity.restitution;

      // if the object's velocity is nearing 0, set it to 0
      if (abs(player.vx) < STICKY_THRESHOLD) {
        player.vx = 0;
      }
    } else {
      player.vy = -player.vy * entity.restitution;
      if (abs(player.vy) < STICKY_THRESHOLD) {
        player.vy = 0;
      }
    }

    // if the object is approaching from the sides
  } else if (absDX > absDY) {
    // if player is approaching from positiveX
    if (dx < 0) {
      player.x = entity.getRight();

      // if player is apporaching from negativeX
    } else {
      player.x = entity.getLeft() - player.width;
    }

    // collision is top or bottom
  } else {
    // positive Y
    if (dy < 0) {
      player.y = entity.getBottom();

      // negative y
    } else {
      player.y = entity.getTop() - player.height;
    }

    // velocity component
    player.vy = -player.vy * entity.restitution;
    if (abs(player.vy) < STICKY_THRESHOLD) {
      player.vy = 0;
    }
  }
};
