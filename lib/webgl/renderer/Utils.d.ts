import { mat4 } from "gl-matrix";
import { ICameraData } from "../../CameraData";
import { RenderLocation } from "../../renderData/RenderData";
export declare const setProjectionMatrix: (projectionMatrix: mat4, gl: WebGL2RenderingContext, cameraData: ICameraData, renderLocation: RenderLocation) => void;
