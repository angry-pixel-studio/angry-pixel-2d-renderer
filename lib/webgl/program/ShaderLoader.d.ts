export interface IShaderLoader {
    load(type: number, source: string): WebGLShader;
}
export declare class ShaderLoader implements IShaderLoader {
    private readonly gl;
    constructor(gl: WebGL2RenderingContext);
    load(type: number, source: string): WebGLShader;
}
