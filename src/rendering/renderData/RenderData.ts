import { Vector2 } from "../../math/Vector2";

export enum RenderLocation {
    WorldSpace,
    ViewPort,
}

export enum RenderDataType {
    Sprite,
    Text,
    Tilemap,
    Mask,
    Geometric,
}

export interface IRenderData {
    type: RenderDataType;
    position: Vector2;
    location: RenderLocation;
    layer: string;
}
