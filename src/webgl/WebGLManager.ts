import { ICameraData } from "../CameraData";
import { IRenderData, RenderDataType } from "../renderData/RenderData";
import { hexToRgba } from "../utils/hexToRgba";
import { IProgramManager } from "./program/ProgramManager";
import { IRenderer } from "./renderer/IRenderer";

export interface IWebGLManager {
    render(renderData: IRenderData, cameraData: ICameraData): void;
    clearCanvas(hexColor: string): void;
}

export class WebGLManager implements IWebGLManager {
    private lastRender: RenderDataType;

    constructor(
        private readonly gl: WebGL2RenderingContext,
        programManager: IProgramManager,
        private readonly renderers: Map<RenderDataType, IRenderer>
    ) {
        programManager.loadProgram();
    }

    public render(renderData: IRenderData, cameraData: ICameraData): void {
        this.renderers.get(renderData.type).render(renderData, cameraData, this.lastRender);
        this.lastRender = renderData.type;
    }

    public clearCanvas(hexColor: string): void {
        const rgb = hexToRgba(hexColor);

        this.gl.clearColor(rgb.r, rgb.g, rgb.b, rgb.a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
}
