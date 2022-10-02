import { ICameraData } from "../../CameraData";
import { RenderDataType } from "../../renderData/RenderData";
import { ICulledTilemapRenderData } from "../../renderData/TilemapRenderData";
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
    constructor(gl: WebGL2RenderingContext, programManager: IProgramManager, textureManager: ITextureManager);
    render(renderData: ICulledTilemapRenderData, cameraData: ICameraData, lastRender?: RenderDataType): void;
    private generateVertices2;
    private generateVertices;
}
