import { IRenderer } from "./IRenderer";
import { IProgramManager } from "../program/ProgramManager";
import { RenderDataType } from "../../renderData/RenderData";
import { ICameraData } from "../../CameraData";
import { IGeometricRenderData } from "../../renderData/GeometricRenderData";
export declare class GeometricRenderer implements IRenderer {
    private readonly gl;
    private readonly programManager;
    readonly type: RenderDataType.Geometric;
    private projectionMatrix;
    private modelMatrix;
    private textureMatrix;
    private readonly vertices;
    private readonly circumferenceVertices;
    private lastVertices;
    private modelPosition;
    constructor(gl: WebGL2RenderingContext, programManager: IProgramManager);
    render(renderData: IGeometricRenderData, cameraData: ICameraData, lastRender?: RenderDataType): void;
    private renderLines;
    private generateVerticesKey;
    private generatePolygonVertices;
    private renderCircumference;
}
