import { Vector2 } from "angry-pixel-math";
import { IRenderData } from "./RenderData";

export enum TextOrientation {
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