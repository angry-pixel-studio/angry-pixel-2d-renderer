export interface IFontAtlasFactory {
    hasFontAtlas(fontFace: FontFace): boolean;
    getFontAtlas(fontFace: FontFace): FontAtlas;
    getOrCreate(charRanges: number[], fontFace: FontFace, bitmapSize: number): FontAtlas;
    create(charRanges: number[], fontFace: FontFace, bitmapSize: number): FontAtlas;
}
export declare class FontAtlasFactory implements IFontAtlasFactory {
    private bitmapSize;
    private chars;
    private fontAtlas;
    hasFontAtlas(fontFace: FontFace): boolean;
    getFontAtlas(fontFace: FontFace): FontAtlas;
    getOrCreate(charRanges: number[], fontFace: FontFace, bitmapSize: number): FontAtlas;
    create(charRanges: number[], fontFace: FontFace, bitmapSize: number): FontAtlas;
    private renderAtlas;
}
export declare class FontAtlas {
    readonly fontFace: FontFace;
    readonly glyphWidth: number;
    readonly glyphHeight: number;
    readonly canvas: HTMLCanvasElement;
    readonly glyphsData: Map<string, GlyphData>;
    constructor(fontFace: FontFace, glyphWidth: number, glyphHeight: number);
}
export interface GlyphData {
    x: number;
    y: number;
}
