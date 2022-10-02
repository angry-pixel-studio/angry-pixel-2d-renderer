import { ICameraData } from "./CameraData";
import { IRenderData } from "./renderData/RenderData";
export interface ICullingManager {
    isInViewPort(renderData: IRenderData, cameraData: ICameraData): boolean;
}
export declare class CullingManager implements ICullingManager {
    private readonly gl;
    private readonly viewport;
    private readonly object;
    private readonly tilesToCull;
    constructor(gl: WebGL2RenderingContext);
    private setViewport;
    private setObjectForResizeable;
    private setObjectForText;
    private setObjectForGeometric;
    private setObjectForTilemap;
    private applyCullingInTiles;
    isInViewPort(renderData: IRenderData, cameraData: ICameraData): boolean;
}
