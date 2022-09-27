export interface ITextureFactory {
    createFromImage(image: HTMLImageElement, smooth?: boolean, texture?: WebGLTexture): WebGLTexture;
    createFromCanvas(canvas: HTMLCanvasElement, smooth?: boolean, texture?: WebGLTexture): WebGLTexture;
}
export declare class TextureFactory implements ITextureFactory {
    private readonly gl;
    constructor(gl: WebGLRenderingContext);
    createFromImage(image: HTMLImageElement, smooth?: boolean, texture?: WebGLTexture): WebGLTexture;
    createFromCanvas(canvas: HTMLCanvasElement, smooth?: boolean, texture?: WebGLTexture): WebGLTexture;
    private create;
}
