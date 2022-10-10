export interface IFontAtlasFactory {
    hasFontAtlas(fontFace: FontFace | string): boolean;
    getFontAtlas(fontFace: FontFace | string): FontAtlas;
    getOrCreate(charRanges: number[], fontFace: FontFace | string, bitmapSize: number): FontAtlas;
    create(charRanges: number[], fontFace: FontFace | string, bitmapSize: number): FontAtlas;
}
export declare class FontAtlasFactory implements IFontAtlasFactory {
    private bitmapSize;
    private chars;
    private fontAtlas;
    hasFontAtlas(fontFace: FontFace | string): boolean;
    getFontAtlas(fontFace: FontFace | string): FontAtlas;
    getOrCreate(charRanges: number[], fontFace: FontFace | string, bitmapSize: number): FontAtlas;
    create(charRanges: number[], fontFace: FontFace | string, bitmapSize: number): FontAtlas;
    private renderAtlas;
}
export declare class FontAtlas {
    readonly fontFaceFamily: string;
    readonly bitmapFontSize: number;
    readonly gridSize: number;
    readonly canvas: HTMLCanvasElement;
    readonly glyphs: Map<string, Glyph>;
    constructor(fontFaceFamily: string, bitmapFontSize: number, gridSize: number);
}
export interface Glyph {
    id: number;
    width: number;
}
