import { mat4 } from "gl-matrix";
import { Rectangle } from "../../../math/Rectangle";
import { Vector2 } from "../../../math/Vector2";
import { ICameraData } from "../../CameraData";
import { RenderDataType, RenderLocation } from "../../renderData/RenderData";
import { ISpriteRenderData } from "../../renderData/SpriteRenderData";
import { hexToRgba } from "../../utils/hexToRgba";
import { IProgramManager } from "../program/ProgramManager";
import { ITextureManager } from "../texture/TextureManager";
import { IRenderer } from "./IRenderer";

export class SpriteRenderer implements IRenderer {
    public readonly type: RenderDataType.Sprite;

    // matrices
    private projectionMatrix: mat4;
    private modelMatrix: mat4;
    private textureMatrix: mat4;

    // vertices
    private posVertices: Float32Array;
    private texVertices: Float32Array;

    // cache
    private renderViewPort: Rectangle = new Rectangle(0, 0, 0, 0);
    private positionInViewport: Vector2 = new Vector2();
    private lastTexture: WebGLTexture = null;

    constructor(
        private readonly gl: WebGL2RenderingContext,
        private readonly programManager: IProgramManager,
        private readonly textureManager: ITextureManager
    ) {
        this.projectionMatrix = mat4.create();
        this.modelMatrix = mat4.create();
        this.textureMatrix = mat4.create();

        // prettier-ignore
        this.posVertices = new Float32Array([
            -0.5, -0.5,
            -0.5, 0.5,
            0.5, -0.5,
            0.5, -0.5,
            -0.5, 0.5,
            0.5, 0.5
        ]);

        // prettier-ignore
        this.texVertices = new Float32Array([
            0, 1,
            0, 0,
            1, 1,
            1, 1,
            0, 0,
            1, 0
        ]);
    }

    public render(renderData: ISpriteRenderData, cameraData: ICameraData, lastRender?: RenderDataType): void {
        if (lastRender !== renderData.type) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.programManager.positionBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, this.posVertices, this.gl.STATIC_DRAW);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.programManager.textureBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, this.texVertices, this.gl.STATIC_DRAW);
        }

        if (renderData.location === RenderLocation.WorldSpace) {
            this.renderViewPort.x = cameraData.viewportRect.x / cameraData.zoom;
            this.renderViewPort.y = cameraData.viewportRect.y / cameraData.zoom;
            this.renderViewPort.width = cameraData.viewportRect.width / cameraData.zoom;
            this.renderViewPort.height = cameraData.viewportRect.height / cameraData.zoom;

            Vector2.add(
                this.positionInViewport,
                this.renderViewPort.center,
                Vector2.subtract(this.positionInViewport, renderData.position, cameraData.positionInWorldSpace)
            );
        } else {
            this.positionInViewport.copy(renderData.position);
            this.renderViewPort.updateFromRect(cameraData.viewportRect);
        }

        this.modelMatrix = mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, [this.positionInViewport.x, this.positionInViewport.y, 0]);
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, renderData.rotation ?? 0);
        mat4.scale(this.modelMatrix, this.modelMatrix, [
            renderData.width * (renderData.flipHorizontal ? -1 : 1),
            renderData.height * (renderData.flipVertical ? -1 : 1),
            1,
        ]);

        this.textureMatrix = mat4.identity(this.textureMatrix);
        if (renderData.slice) {
            mat4.translate(this.textureMatrix, this.textureMatrix, [
                renderData.slice.x / renderData.image.naturalWidth,
                renderData.slice.y / renderData.image.naturalHeight,
                0,
            ]);
            mat4.scale(this.textureMatrix, this.textureMatrix, [
                renderData.slice.width / renderData.image.naturalWidth,
                renderData.slice.height / renderData.image.naturalHeight,
                1,
            ]);
        }

        this.projectionMatrix = mat4.identity(this.projectionMatrix);
        mat4.ortho(
            this.projectionMatrix,
            this.renderViewPort.x,
            this.renderViewPort.x1,
            this.renderViewPort.y,
            this.renderViewPort.y1,
            -1,
            1
        );

        this.gl.uniformMatrix4fv(this.programManager.projectionMatrixUniform, false, this.projectionMatrix);
        this.gl.uniformMatrix4fv(this.programManager.modelMatrixUniform, false, this.modelMatrix);
        this.gl.uniformMatrix4fv(this.programManager.textureMatrixUniform, false, this.textureMatrix);

        this.gl.enable(this.gl.BLEND);

        const texture = this.textureManager.getOrCreateTextureFromImage(renderData.image, renderData.smooth);
        if (this.lastTexture !== texture || lastRender !== renderData.type) {
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.uniform1i(this.programManager.textureUniform, 0);
            this.lastTexture = texture;
        }

        this.gl.uniform1i(this.programManager.renderTextureUniform, 1);
        this.gl.uniform1f(this.programManager.alphaUniform, renderData.alpha ?? 1);

        this.gl.uniform1i(this.programManager.useTintColorUniform, renderData.tintColor ? 1 : 0);
        if (renderData.tintColor) {
            const { r, g, b, a } = hexToRgba(renderData.tintColor);
            this.gl.uniform4f(this.programManager.tintColorUniform, r, g, b, a);
        }

        this.gl.uniform1i(this.programManager.useMaskColorUniform, renderData.maskColor ? 1 : 0);
        if (renderData.maskColor) {
            const { r, g, b } = hexToRgba(renderData.maskColor);
            this.gl.uniform4f(this.programManager.maskColorUniform, r, g, b, renderData.alpha);
            this.gl.uniform1f(this.programManager.maskColorMixUniform, renderData.maskColorMix ?? 0);
        }

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}
