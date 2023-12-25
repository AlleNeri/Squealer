export interface DimensionDirective {
  pixelThreshold: number;
  isTooSmall(width: number): boolean;
}
