import { Rectangle } from "../math/Rectangle";
import { Vector2 } from "../math/Vector2";

export interface ICameraData {
    depth: number;
    layers: string[];
    positionInWorldSpace: Vector2;
    viewportRect: Rectangle;
    zoom: number;
}
