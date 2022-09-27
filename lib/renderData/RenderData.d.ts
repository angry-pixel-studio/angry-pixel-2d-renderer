import { Vector2 } from "angry-pixel-math";
export declare enum RenderLocation {
    WorldSpace = 0,
    ViewPort = 1
}
export declare enum RenderDataType {
    Sprite = 0,
    Text = 1,
    Tilemap = 2,
    Mask = 3,
    Geometric = 4
}
export interface IRenderData {
    type: RenderDataType;
    position: Vector2;
    location: RenderLocation;
    layer: string;
}
