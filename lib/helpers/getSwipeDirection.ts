export type SwipeDirection = "left" | "right" | null;

export const getSwipeDirection = (
  offsetX: number,
  threshold = 50
): SwipeDirection => {
  if (offsetX < -threshold) return "left";
  if (offsetX > threshold) return "right";
  return null;
};
