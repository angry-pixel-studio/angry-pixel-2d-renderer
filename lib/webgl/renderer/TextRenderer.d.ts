import { ICameraData } from "../../CameraData";
import { RenderDataType } from "../../renderData/RenderData";
import { ITextRenderData } from "../../renderData/TextRenderData";
import { IFontAtlasFactory } from "../FontAtlasFactory";
import { IProgramManager } from "../program/ProgramManager";
import { ITextureManager } from "../texture/TextureManager";
import { IRenderer } from "./IRenderer";
export declare class TextRenderer implements IRenderer {
    private readonly gl;
    private readonly programManager;
    private readonly textureManager;
    private readonly fontAtlasFactory;
    readonly type: RenderDataType;
    private projectionMatrix;
    private modelMatrix;
    private textureMatrix;
    private posVertices;
    private texVertices;
    private lastTexture;
    private textSize;
    private modelPosition;
    constructor(gl: WebGL2RenderingContext, programManager: IProgramManager, textureManager: ITextureManager, fontAtlasFactory: IFontAtlasFactory);
    render(renderData: ITextRenderData, cameraData: ICameraData, lastRender: RenderDataType): void;
    private setDefaultValues;
    private generateTextVertices;
    private setPositionFromOrientation;
}
