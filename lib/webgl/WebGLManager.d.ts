import { ICameraData } from "../CameraData";
import { IRenderData, RenderDataType } from "../renderData/RenderData";
import { IProgramManager } from "./program/ProgramManager";
import { IRenderer } from "./renderer/IRenderer";
export interface IWebGLManager {
    render(renderData: IRenderData, cameraData: ICameraData): void;
    clearCanvas(hexColor: string): void;
}
export declare class WebGLManager implements IWebGLManager {
    readonly gl: WebGL2RenderingContext;
    private readonly renderers;
    private lastRender;
    constructor(gl: WebGL2RenderingContext, programManager: IProgramManager, renderers: Map<RenderDataType, IRenderer>);
    render(renderData: IRenderData, cameraData: ICameraData): void;
    clearCanvas(hexColor: string): void;
}
