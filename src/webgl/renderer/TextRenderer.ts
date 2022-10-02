import { mat4, ReadonlyVec3 } from "gl-matrix";
import { Vector2 } from "angry-pixel-math";
import { ICameraData } from "../../CameraData";
import { RenderDataType } from "../../renderData/RenderData";
import { ITextRenderData, TextOrientation } from "../../renderData/TextRenderData";
import { hexToRgba } from "../../utils/hexToRgba";
import { FontAtlas, IFontAtlasFactory } from "../FontAtlasFactory";
import { IProgramManager } from "../program/ProgramManager";
import { ITextureManager } from "../texture/TextureManager";
import { IRenderer } from "./IRenderer";
import { setProjectionMatrix } from "./Utils";

const TEXTURE_CORRECTION = 1;
const DEFAULT_BITMAP_SIZE = 64;
const DEFAULT_BITMAP_OFFSET = new Vector2();
const DEFAULT_CHAR_RANGES = [32, 126, 161, 255];
const DEFAULT_COLOR = "#000000";
const DEFAULT_LETTER_SPACING = 0;
const DEFAULT_LINE_SEPARATION = 0;
const DEFAULT_ORIENTATION = TextOrientation.Center;
const DEFAULT_OPACITY = 1;
const DEFAULT_ROTATION = 0;

export class TextRenderer implements IRenderer {
    public readonly type: RenderDataType = RenderDataType.Text;

    // matrices
    private projectionMatrix: mat4;
    private modelMatrix: mat4;
    private textureMatrix: mat4;

    // vertices
    private posVertices: number[] = [];
    private texVertices: number[] = [];
    private posVerticesSize: Vector2 = new Vector2();

    // cache
    private lastTexture: WebGLTexture = null;

    constructor(
        private readonly gl: WebGL2RenderingContext,
        private readonly programManager: IProgramManager,
        private readonly textureManager: ITextureManager,
        private readonly fontAtlasFactory: IFontAtlasFactory
    ) {
        this.projectionMatrix = mat4.create();
        this.modelMatrix = mat4.create();
        this.textureMatrix = mat4.create();
    }

    public render(renderData: ITextRenderData, cameraData: ICameraData, lastRender: RenderDataType): void {
        if (!renderData.text) return;

        this.setDefaultValues(renderData);

        const fontAtlas = this.fontAtlasFactory.getOrCreate(
            renderData.charRanges,
            renderData.font,
            renderData.bitmapSize
        );

        this.generateTextVertices(fontAtlas, renderData);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.programManager.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.posVertices), this.gl.DYNAMIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.programManager.textureBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.texVertices), this.gl.DYNAMIC_DRAW);

        this.modelMatrix = mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, this.getTranslationForOrientation(renderData));
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, renderData.rotation);

        this.textureMatrix = mat4.identity(this.textureMatrix);
        mat4.scale(this.textureMatrix, this.textureMatrix, [
            1 / fontAtlas.canvas.width,
            1 / fontAtlas.canvas.height,
            1,
        ]);

        setProjectionMatrix(this.projectionMatrix, this.gl, cameraData, renderData.location);

        this.gl.uniformMatrix4fv(this.programManager.projectionMatrixUniform, false, this.projectionMatrix);
        this.gl.uniformMatrix4fv(this.programManager.modelMatrixUniform, false, this.modelMatrix);
        this.gl.uniformMatrix4fv(this.programManager.textureMatrixUniform, false, this.textureMatrix);

        if (renderData.opacity < 1) {
            this.gl.enable(this.gl.BLEND);
        } else {
            this.gl.disable(this.gl.BLEND);
        }

        const texture = this.textureManager.getOrCreateTextureFromCanvas(
            fontAtlas.fontFace.family,
            fontAtlas.canvas,
            renderData.smooth
        );

        if (this.lastTexture !== texture || lastRender !== RenderDataType.Text) {
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.uniform1i(this.programManager.textureUniform, 0);
            this.lastTexture = texture;
        }

        this.gl.uniform1i(this.programManager.useTintColorUniform, 0);
        this.gl.uniform1i(this.programManager.renderTextureUniform, 1);
        this.gl.uniform1f(this.programManager.alphaUniform, renderData.opacity);

        const { r, g, b, a } = hexToRgba(renderData.color);
        this.gl.uniform4f(this.programManager.maskColorUniform, r, g, b, a);
        this.gl.uniform1f(this.programManager.maskColorMixUniform, 1);
        this.gl.uniform1i(this.programManager.useMaskColorUniform, 1);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.posVertices.length / 2);
    }

    private setDefaultValues(renderData: ITextRenderData): void {
        renderData.bitmapOffset = renderData.bitmapOffset ?? DEFAULT_BITMAP_OFFSET;
        renderData.bitmapSize = renderData.bitmapSize ?? DEFAULT_BITMAP_SIZE;
        renderData.charRanges = renderData.charRanges ?? DEFAULT_CHAR_RANGES;
        renderData.color = renderData.color ?? DEFAULT_COLOR;
        renderData.letterSpacing = renderData.letterSpacing ?? DEFAULT_LETTER_SPACING;
        renderData.lineSeparation = renderData.lineSeparation ?? DEFAULT_LINE_SEPARATION;
        renderData.opacity = renderData.opacity ?? DEFAULT_OPACITY;
        renderData.orientation = renderData.orientation ?? DEFAULT_ORIENTATION;
        renderData.rotation = renderData.rotation ?? DEFAULT_ROTATION;
    }

    private generateTextVertices(fontAtlas: FontAtlas, renderData: ITextRenderData): void {
        this.posVertices = [];
        this.texVertices = [];

        const d = this.getDimensions(renderData);
        const p = { x1: -d.width / 2, y1: d.height / 2 - renderData.fontSize, x2: 0, y2: d.height / 2 };
        const t = { x1: 0, y1: 0, x2: 0, y2: 0 };

        for (let i = 0; i < renderData.text.length; i++) {
            const letter = renderData.text[i];

            if (letter === "\n") {
                p.y1 -= renderData.fontSize + renderData.lineSeparation;
                p.y2 = p.y1 + renderData.fontSize;
                p.x1 = -d.width / 2;
                continue;
            }

            if (letter === " ") {
                p.x1 += renderData.fontSize + renderData.letterSpacing;
                continue;
            }

            const glyphInfo = fontAtlas.glyphsData.get(letter);

            if (glyphInfo) {
                p.x2 = p.x1 + renderData.fontSize;

                t.x1 = glyphInfo.x + renderData.bitmapOffset.x;
                t.y1 = glyphInfo.y + renderData.bitmapOffset.y;
                t.x2 = glyphInfo.x + fontAtlas.glyphWidth - TEXTURE_CORRECTION;
                t.y2 = glyphInfo.y + fontAtlas.glyphHeight - TEXTURE_CORRECTION;

                // prettier-ignore
                this.posVertices.push(
                    p.x1, p.y1,
                    p.x2, p.y1,
                    p.x1, p.y2,
                    p.x1, p.y2,
                    p.x2, p.y1,
                    p.x2, p.y2
                );

                // prettier-ignore
                this.texVertices.push(
                    t.x1, t.y2,
                    t.x2, t.y2,
                    t.x1, t.y1,
                    t.x1, t.y1,
                    t.x2, t.y2,
                    t.x2, t.y1
                );
            }

            p.x1 += renderData.fontSize + renderData.letterSpacing;
        }

        this.posVerticesSize.set(d.width, d.height);
    }

    private getDimensions(renderData: ITextRenderData): { width: number; height: number } {
        return renderData.text.split("\n").reduce(
            (acc, str, idx) => {
                acc.width = Math.max(acc.width, str.length * (renderData.fontSize + renderData.letterSpacing));
                acc.height += renderData.fontSize + Math.min(idx, 1) * renderData.lineSeparation;
                return acc;
            },
            { width: 0, height: 0 }
        );
    }

    private getTranslationForOrientation(renderData: ITextRenderData): ReadonlyVec3 {
        return [
            renderData.position.x +
                (renderData.orientation === TextOrientation.Center ? 0 : this.posVerticesSize.x / 2),
            renderData.position.y +
                (renderData.orientation === TextOrientation.RightDown
                    ? -this.posVerticesSize.y / 2
                    : renderData.orientation === TextOrientation.RightUp
                    ? this.posVerticesSize.y
                    : 0),
            0,
        ];
    }
}
