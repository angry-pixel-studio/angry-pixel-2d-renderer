import { mat4 } from "gl-matrix";
import { ICameraData } from "../../CameraData";
import { RenderDataType } from "../../renderData/RenderData";
import { ITilemapRenderData } from "../../renderData/TilemapRenderData";
import { hexToRgba } from "../../utils/hexToRgba";
import { IProgramManager } from "../program/ProgramManager";
import { ITextureManager } from "../texture/TextureManager";
import { IRenderer } from "./IRenderer";
import { setProjectionMatrix } from "./Utils";

export class TilemapRenderer implements IRenderer {
    public readonly type: RenderDataType.Tilemap;

    // matrices
    private projectionMatrix: mat4;
    private modelMatrix: mat4;
    private textureMatrix: mat4;

    // vertices
    private posVertices: number[] = [];
    private texVertices: number[] = [];

    // cache
    private lastTexture: WebGLTexture = null;

    constructor(
        private readonly gl: WebGL2RenderingContext,
        private readonly programManager: IProgramManager,
        private readonly textureManager: ITextureManager
    ) {
        this.projectionMatrix = mat4.create();
        this.modelMatrix = mat4.create();
        this.textureMatrix = mat4.create();
    }

    public render(renderData: ITilemapRenderData, cameraData: ICameraData, lastRender?: RenderDataType): void {
        this.generateVertices(renderData);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.programManager.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.posVertices), this.gl.DYNAMIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.programManager.textureBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.texVertices), this.gl.DYNAMIC_DRAW);

        this.modelMatrix = mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, [
            renderData.position.x - (renderData.tilemap.width * renderData.tilemap.tileWidth) / 2,
            renderData.position.y +
                (Math.floor(renderData.tiles.length / renderData.tilemap.width) * renderData.tilemap.tileHeight) / 2,
            0,
        ]);
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, renderData.rotation ?? 0);
        mat4.scale(this.modelMatrix, this.modelMatrix, [
            renderData.tilemap.tileWidth,
            renderData.tilemap.tileHeight,
            1,
        ]);

        this.textureMatrix = mat4.identity(this.textureMatrix);
        mat4.scale(this.textureMatrix, this.textureMatrix, [
            renderData.tileset.tileWidth / renderData.image.naturalWidth,
            renderData.tileset.tileHeight / renderData.image.naturalHeight,
            1,
        ]);

        setProjectionMatrix(this.projectionMatrix, cameraData, renderData.location);

        this.gl.uniformMatrix4fv(this.programManager.projectionMatrixUniform, false, this.projectionMatrix);
        this.gl.uniformMatrix4fv(this.programManager.modelMatrixUniform, false, this.modelMatrix);
        this.gl.uniformMatrix4fv(this.programManager.textureMatrixUniform, false, this.textureMatrix);

        this.gl.enable(this.gl.BLEND);

        const texture = this.textureManager.getOrCreateTextureFromImage(renderData.image, renderData.smooth);

        if (this.lastTexture !== texture || lastRender !== RenderDataType.Tilemap) {
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.uniform1i(this.programManager.textureUniform, 0);
            this.lastTexture = texture;
        }

        this.gl.uniform1i(this.programManager.useMaskColorUniform, 0);
        this.gl.uniform1i(this.programManager.renderTextureUniform, 1);
        this.gl.uniform1f(this.programManager.alphaUniform, renderData.alpha ?? 1);

        this.gl.uniform1i(this.programManager.useTintColorUniform, renderData.tintColor ? 1 : 0);
        if (renderData.tintColor) {
            const { r, g, b, a } = hexToRgba(renderData.tintColor);
            this.gl.uniform4f(this.programManager.tintColorUniform, r, g, b, a);
        }

        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.posVertices.length / 2);
    }

    private generateVertices(renderData: ITilemapRenderData): void {
        this.posVertices = [];
        this.texVertices = [];

        let tmy = 0;

        renderData.tiles.forEach((tilesetTile, tilemapTile) => {
            if (tilesetTile === 0) return;

            const tmx = tilemapTile % renderData.tilemap.width;
            tmy = tilemapTile > 0 && tmx === 0 ? tmy - 1 : tmy;

            // prettier-ignore
            this.posVertices.push(
                tmx, tmy-1,
                tmx+1, tmy-1,
                tmx, tmy,
                tmx, tmy,
                tmx+1, tmy-1,
                tmx+1, tmy
            )

            const tsx = (tilesetTile - 1) % renderData.tileset.width;
            const tsy = Math.floor((tilesetTile - 1) / renderData.tileset.width);

            // prettier-ignore
            this.texVertices.push( 
                tsx, tsy  +1,
                tsx + 1, tsy  +1,
                tsx, tsy,
                tsx, tsy,
                tsx + 1, tsy  +1,
                tsx + 1, tsy
            );
        });
    }
}
