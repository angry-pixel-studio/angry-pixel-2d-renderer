import { Rectangle, Vector2 } from "angry-pixel-math";

export interface ICameraData {
    depth: number;
    layers: string[];
    positionInWorldSpace: Vector2;
    viewportRect: Rectangle;
    zoom: number;
}
