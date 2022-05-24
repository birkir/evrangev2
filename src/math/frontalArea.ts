export function calculateTireHeight([width, profile, size]: number[]) {
  const tireHeight = width * (profile / 100);
  const wheelHeight = size * 25.4;
  return tireHeight * 2 + wheelHeight;
}

export function calculateFrontalAreaAfterTireChange(frontalArea: number, clearance: number, originalSize: number[], nextSize: number[]) {
  const originalHeight = calculateTireHeight(originalSize);
  const centerPoint = originalHeight / 2;
  const centerPointToClearance = centerPoint - clearance;
  const nextHeight = calculateTireHeight(nextSize);
  const nextCenterPoint = nextHeight / 2;
  const nextClearance = nextCenterPoint - centerPointToClearance
  const frontalAreaWithoutTires = frontalArea - (clearance * originalSize[0]) * 2;
  return frontalAreaWithoutTires + (nextClearance * nextSize[0]) * 2;
}

export function estimateReferenceArea(width: number, height: number, clearance?: number, tireSize: number[] = [205,55,16]) {
  if (!clearance) {
    return (width * height * 0.85) / 1000000;
  }
  const area = width * (height - clearance) * 0.964;
  const tireArea = (tireSize[0] * clearance);
  return (area - (tireArea * 2)) / 1000000
}