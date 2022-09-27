import { WebGLContextVersion } from "../ContextManager";
import { IProgramFactory } from "./ProgramFactory";
export interface IProgramManager {
    positionBuffer: WebGLBuffer;
    textureBuffer: WebGLBuffer;
    positionCoordsAttr: GLint;
    texCoordsAttr: GLint;
    modelMatrixUniform: WebGLUniformLocation;
    projectionMatrixUniform: WebGLUniformLocation;
    textureMatrixUniform: WebGLUniformLocation;
    renderTextureUniform: WebGLUniformLocation;
    textureUniform: WebGLUniformLocation;
    solidColorUniform: WebGLUniformLocation;
    useTintColorUniform: WebGLUniformLocation;
    tintColorUniform: WebGLUniformLocation;
    useMaskColorUniform: WebGLUniformLocation;
    maskColorUniform: WebGLUniformLocation;
    maskColorMixUniform: WebGLUniformLocation;
    alphaUniform: WebGLUniformLocation;
    loadProgram(): void;
}
export declare class ProgramManager implements IProgramManager {
    private readonly gl;
    private readonly contextVersion;
    private readonly programFactory;
    private program;
    positionBuffer: WebGLBuffer;
    textureBuffer: WebGLBuffer;
    positionCoordsAttr: GLint;
    texCoordsAttr: GLint;
    modelMatrixUniform: WebGLUniformLocation;
    projectionMatrixUniform: WebGLUniformLocation;
    textureMatrixUniform: WebGLUniformLocation;
    renderTextureUniform: WebGLUniformLocation;
    textureUniform: WebGLUniformLocation;
    solidColorUniform: WebGLUniformLocation;
    useTintColorUniform: WebGLUniformLocation;
    tintColorUniform: WebGLUniformLocation;
    useMaskColorUniform: WebGLUniformLocation;
    maskColorUniform: WebGLUniformLocation;
    maskColorMixUniform: WebGLUniformLocation;
    alphaUniform: WebGLUniformLocation;
    constructor(gl: WebGL2RenderingContext, contextVersion: WebGLContextVersion, programFactory: IProgramFactory);
    loadProgram(): void;
}
