import { ICameraData } from "../../CameraData";
import { RenderDataType } from "../../renderData/RenderData";
import { IProcessedTilemapData } from "../../renderData/TilemapRenderData";
import { IProgramManager } from "../program/ProgramManager";
import { ITextureManager } from "../texture/TextureManager";
import { IRenderer } from "./IRenderer";
export declare class TilemapRenderer implements IRenderer {
    private readonly gl;
    private readonly programManager;
    private readonly textureManager;
    readonly type: RenderDataType.Tilemap;
    private projectionMatrix;
    private modelMatrix;
    private textureMatrix;
    private posVertices;
    private texVertices;
    private lastTexture;
    private tileset;
    private modelPosition;
    constructor(gl: WebGL2RenderingContext, programManager: IProgramManager, textureManager: ITextureManager);
    render(renderData: IProcessedTilemapData, cameraData: ICameraData, lastRender?: RenderDataType): void;
    private processTileset;
    private generateVertices;
}
