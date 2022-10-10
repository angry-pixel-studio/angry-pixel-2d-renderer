import { Vector2 } from "angry-pixel-math";
import { IRenderData } from "./RenderData";
export declare enum TextOrientation {
    Center = 0,
    RightUp = 1,
    RightDown = 2,
    RightCenter = 3
}
export interface ITextRenderData extends IRenderData {
    font: FontFace | string;
    text: string;
    fontSize: number;
    color?: string;
    lineSeparation?: number;
    letterSpacing?: number;
    orientation?: TextOrientation;
    rotation?: number;
    opacity?: number;
    smooth?: boolean;
    bitmap?: {
        charRanges?: number[];
        fontSize?: number;
        margin?: Vector2;
        spacing?: Vector2;
    };
}
