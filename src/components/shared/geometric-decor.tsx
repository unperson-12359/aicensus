/**
 * GeometricDecor — neutralized for the B&W bento redesign.
 *
 * We keep the same public API (component + shape presets) so consuming pages
 * don't need to be touched, but rendering is a no-op. The minimalist theme
 * does its own work with tile borders and grid patterns instead.
 */

type ShapeType = "circle" | "ring" | "cross" | "half-circle" | "line" | "dot" | "triangle";
type ShapeColor = "primary" | "accent" | "neon";

export interface GeometricShape {
  type: ShapeType;
  color: ShapeColor;
  size: number;
  opacity: number;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  parallaxSpeed?: number;
  rotate?: number;
  blur?: number;
}

interface GeometricDecorProps {
  shapes: GeometricShape[];
  className?: string;
}

export function GeometricDecor(props: GeometricDecorProps) {
  void props;
  return null;
}

export const heroShapes: GeometricShape[] = [];
export const sectionShapes: GeometricShape[] = [];
export const ctaShapes: GeometricShape[] = [];
export const pageHeaderShapes: GeometricShape[] = [];
export const aboutHeroShapes: GeometricShape[] = [];
