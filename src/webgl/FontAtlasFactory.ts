export interface IFontAtlasFactory {
    hasFontAtlas(fontFace: FontFace): boolean;
    getFontAtlas(fontFace: FontFace): FontAtlas;
    getOrCreate(charRanges: number[], fontFace: FontFace, bitmapSize: number): FontAtlas;
    create(charRanges: number[], fontFace: FontFace, bitmapSize: number): FontAtlas;
}

export class FontAtlasFactory implements IFontAtlasFactory {
    private bitmapSize: number;
    private chars: string[];
    private fontAtlas: Map<symbol, FontAtlas> = new Map<symbol, FontAtlas>();

    public hasFontAtlas(fontFace: FontFace): boolean {
        return this.fontAtlas.has(Symbol.for(fontFace.family));
    }

    public getFontAtlas(fontFace: FontFace): FontAtlas {
        return this.fontAtlas.get(Symbol.for(fontFace.family));
    }

    public getOrCreate(charRanges: number[], fontFace: FontFace, bitmapSize: number): FontAtlas {
        return this.getFontAtlas(fontFace) ?? this.create(charRanges, fontFace, bitmapSize);
    }

    public create(charRanges: number[], fontFace: FontFace, bitmapSize: number): FontAtlas {
        this.bitmapSize = bitmapSize;

        this.chars = [];
        for (let i = 0; i < charRanges.length; i = i + 2) {
            for (let j = charRanges[i]; j <= charRanges[i + 1]; j++) {
                this.chars.push(String.fromCharCode(j));
            }
        }

        const fontAtlas = this.renderAtlas(fontFace);
        this.fontAtlas.set(Symbol.for(fontFace.family), fontAtlas);

        return fontAtlas;
    }

    private renderAtlas(fontFace: FontFace): FontAtlas {
        const fontAtlas: FontAtlas = new FontAtlas(fontFace);

        fontAtlas.canvas.width = Math.round(Math.sqrt(this.chars.length)) * this.bitmapSize;
        fontAtlas.canvas.height = fontAtlas.canvas.width;

        const ctx: CanvasRenderingContext2D = fontAtlas.canvas.getContext("2d");

        ctx.clearRect(0, 0, fontAtlas.canvas.width, fontAtlas.canvas.height);
        ctx.textBaseline = "top";
        ctx.fillStyle = "#000";
        ctx.font = `${this.bitmapSize}px ${fontFace.family}`;

        let x: number = 0;
        let y: number = 0;

        for (let i = 0; i < this.chars.length; i++) {
            ctx.fillText(this.chars[i], x, y);

            fontAtlas.glyphsData.set(this.chars[i], {
                x: x,
                y: y,
                width: this.bitmapSize,
                height: this.bitmapSize,
            });

            if ((x += this.bitmapSize) > fontAtlas.canvas.width - this.bitmapSize) {
                x = 0;
                y += this.bitmapSize;
            }
        }

        return fontAtlas;
    }
}

export class FontAtlas {
    public readonly canvas: HTMLCanvasElement = document.createElement("canvas");
    public readonly glyphsData: Map<string, GlyphData> = new Map<string, GlyphData>();

    constructor(public readonly fontFace: FontFace) {}
}

export interface GlyphData {
    x: number;
    y: number;
    width: number;
    height: number;
}
