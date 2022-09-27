import { IRenderData } from "./RenderData";
export declare enum TilemapOrientation {
    Center = 0,
    RightUp = 1,
    RightDown = 2,
    RightCenter = 3
}
export interface ITilemapRenderData extends IRenderData {
    image: HTMLImageElement;
    tiles: number[];
    tilemap: {
        width: number;
        tileWidth: number;
        tileHeight: number;
    };
    tileset: {
        width: number;
        tileWidth: number;
        tileHeight: number;
    };
    smooth?: boolean;
    flipHorizontal?: boolean;
    flipVertical?: boolean;
    rotation?: number;
    alpha?: number;
    maskColor?: string;
    maskColorMix?: number;
    tintColor?: string;
    textureCorrection?: number;
    orientation?: TilemapOrientation;
}
