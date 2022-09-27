import { ICameraData } from "../../CameraData";
import { IMaskRenderData } from "../../renderData/MaskRenderData";
import { RenderDataType } from "../../renderData/RenderData";
import { IProgramManager } from "../program/ProgramManager";
import { IRenderer } from "./IRenderer";
export declare class MaskRenderer implements IRenderer {
    private readonly gl;
    private readonly programManager;
    readonly type: RenderDataType;
    private projectionMatrix;
    private modelMatrix;
    private textureMatrix;
    private readonly vertices;
    constructor(gl: WebGL2RenderingContext, programManager: IProgramManager);
    render(renderData: IMaskRenderData, cameraData: ICameraData, lastRender?: RenderDataType): void;
}
