// TLDR: if it doesn't overlap, it does not collide
// only works for convex things

// rect collision tests the edges of each react to
// look for overlap
CollisionDetector.prototype.collideRect = (collider, collidee) => {
  // store collider and collidee edges
  let left1 = collider.getLeft();
  let top1 = collider.getTop();
  let right1 = collider.getRight();
  let bottom1 = collider.getBottom();

  let left2 = collidee.getLeft();
  let top2 = collidee.getTop();
  let right2 = collidee.getRight();
  let bottom2 = collidee.getBottom();

  // if any any of the edges are
  if (bottom1 < top2 || top1 > bottom2 || right1 < left2 || left1 < right2) {
    return false;
  }

  // if the algorithm made it here, it had to collider
  return true;
};
