import { ITextureFactory } from "./TextureFactory";
export interface ITextureManager {
    getOrCreateTextureFromImage(image: HTMLImageElement, smooth?: boolean): WebGLTexture;
    createTextureFromImage(image: HTMLImageElement, smooth?: boolean): WebGLTexture;
    getOrCreateTextureFromCanvas(name: string, canvas: HTMLCanvasElement, smooth?: boolean): WebGLTexture;
    createTextureFromCanvas(name: string, canvas: HTMLCanvasElement, smooth?: boolean): WebGLTexture;
}
export declare class TextureManager implements ITextureManager {
    private readonly textureFactory;
    private readonly textures;
    constructor(textureFactory: ITextureFactory);
    getOrCreateTextureFromImage(image: HTMLImageElement, smooth?: boolean): WebGLTexture;
    createTextureFromImage(image: HTMLImageElement, smooth?: boolean): WebGLTexture;
    getOrCreateTextureFromCanvas(name: string, canvas: HTMLCanvasElement, smooth?: boolean): WebGLTexture;
    createTextureFromCanvas(name: string, canvas: HTMLCanvasElement, smooth?: boolean): WebGLTexture;
}
