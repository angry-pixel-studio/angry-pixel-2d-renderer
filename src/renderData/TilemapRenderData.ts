import { IRenderData } from "./RenderData";

export enum TilemapOrientation {
    Center,
    RightUp,
    RightDown,
    RightCenter,
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

export interface ICulledTilemapRenderData extends ITilemapRenderData {
    culledTiles: number[];
}
