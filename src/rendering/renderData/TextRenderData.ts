import { Vector2 } from "../../math/Vector2";
import { IRenderData } from "./RenderData";

export enum Orientation {
    Center,
    RightUp,
    RightDown,
    RightCenter,
}

export interface ITextRenderData extends IRenderData {
    font: FontFace;
    text: string;
    fontSize: number;
    width: number;
    height: number;
    smooth: boolean;
    color?: string;
    lineSeparation?: number;
    letterSpacing?: number;
    charRanges?: number[];
    bitmapSize?: number;
    bitmapOffset?: Vector2;
    orientation?: Orientation;
    rotation?: number;
    opacity?: number;
}
