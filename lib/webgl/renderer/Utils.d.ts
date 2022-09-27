import { mat4 } from "gl-matrix";
import { ICameraData } from "../../CameraData";
import { RenderLocation } from "../../renderData/RenderData";
export declare const setProjectionMatrix: (projectionMatrix: mat4, cameraData: ICameraData, renderLocation: RenderLocation) => void;
