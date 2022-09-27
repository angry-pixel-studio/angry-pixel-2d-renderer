import { IShaderLoader } from "./ShaderLoader";
export interface IProgramFactory {
    create(vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram;
}
export declare class ProgramFactory implements IProgramFactory {
    private readonly gl;
    private readonly shaderLoader;
    constructor(gl: WebGL2RenderingContext, shaderLoader: IShaderLoader);
    create(vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram;
}
