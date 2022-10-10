import { ICameraData } from "../../CameraData";
import { RenderDataType } from "../../renderData/RenderData";
import { ISpriteRenderData } from "../../renderData/SpriteRenderData";
import { IProgramManager } from "../program/ProgramManager";
import { ITextureManager } from "../texture/TextureManager";
import { IRenderer } from "./IRenderer";
export declare class SpriteRenderer implements IRenderer {
    private readonly gl;
    private readonly programManager;
    private readonly textureManager;
    readonly type: RenderDataType.Sprite;
    private projectionMatrix;
    private modelMatrix;
    private textureMatrix;
    private posVertices;
    private texVertices;
    private lastTexture;
    private modelPosition;
    constructor(gl: WebGL2RenderingContext, programManager: IProgramManager, textureManager: ITextureManager);
    render(renderData: ISpriteRenderData, cameraData: ICameraData, lastRender?: RenderDataType): void;
}
