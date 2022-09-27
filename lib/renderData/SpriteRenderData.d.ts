import { IRenderData } from "./RenderData";
export interface ISpriteRenderData extends IRenderData {
    image: HTMLImageElement;
    width: number;
    height: number;
    smooth?: boolean;
    slice?: Slice;
    flipHorizontal?: boolean;
    flipVertical?: boolean;
    rotation?: number;
    alpha?: number;
    maskColor?: string;
    maskColorMix?: number;
    tintColor?: string;
}
export interface Slice {
    x: number;
    y: number;
    width: number;
    height: number;
}
