import { Vector2 } from "angry-pixel-math";
import { IRenderData } from "./RenderData";
export declare enum TextOrientation {
    Center = 0,
    RightUp = 1,
    RightDown = 2,
    RightCenter = 3
}
export interface ITextRenderData extends IRenderData {
    font: FontFace;
    text: string;
    fontSize: number;
    smooth?: boolean;
    color?: string;
    lineSeparation?: number;
    letterSpacing?: number;
    charRanges?: number[];
    bitmapSize?: number;
    bitmapOffset?: Vector2;
    orientation?: TextOrientation;
    rotation?: number;
    opacity?: number;
}
