export declare enum WebGLContextVersion {
    LegacyWebGL = "webgl",
    WebGL2 = "webgl2"
}
export interface IContextManager {
    readonly gl: WebGL2RenderingContext;
}
export declare class ContextManager implements IContextManager {
    readonly canvas: HTMLCanvasElement;
    readonly gl: WebGL2RenderingContext;
    readonly contextVersion: WebGLContextVersion;
    constructor(canvas: HTMLCanvasElement);
    private getContextVersion;
}
