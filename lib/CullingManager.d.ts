import { ICameraData } from "./CameraData";
import { IRenderData } from "./renderData/RenderData";
export interface ICullingManager {
    applyCulling(cameraData: ICameraData, renderData: IRenderData[]): IRenderData[];
}
export declare class CullingManager implements ICullingManager {
    private readonly gl;
    private readonly viewport;
    private readonly object;
    constructor(gl: WebGL2RenderingContext);
    private setViewport;
    private setObjectForResizeable;
    private setObjectForText;
    private setObjectForGeometric;
    private setObjectForTilemap;
    private applyCullingInTiles;
    isInViewPort(renderData: IRenderData, cameraData: ICameraData): boolean;
    applyCulling(cameraData: ICameraData, renderData: IRenderData[]): IRenderData[];
}
