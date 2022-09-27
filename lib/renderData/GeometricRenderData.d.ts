import { Vector2 } from "angry-pixel-math";
import { IRenderData } from "./RenderData";
export declare enum GeometricShape {
    Polygon = 0,
    Circumference = 1,
    Line = 2
}
export interface IGeometricRenderData extends IRenderData {
    color: string;
    shape: GeometricShape;
    vertexModel?: Vector2[];
    rotation?: number;
    radius?: number;
}
