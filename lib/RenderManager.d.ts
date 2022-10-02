import { ICameraData } from "./CameraData";
import { ICullingManager } from "./CullingManager";
import { IRenderData } from "./renderData/RenderData";
import { IWebGLManager } from "./webgl/WebGLManager";
export interface IRenderManager {
    addRenderData<T extends IRenderData>(data: T): void;
    addCameraData(data: ICameraData): void;
    render(): void;
    clearData(): void;
    clearScreen(hexColor: string): void;
}
export declare class RenderManager implements IRenderManager {
    private readonly webglManager;
    private readonly cullingManager;
    private renderData;
    private cameraData;
    constructor(webglManager: IWebGLManager, cullingManager: ICullingManager);
    addRenderData<T extends IRenderData>(data: T): void;
    addCameraData(data: ICameraData): void;
    render(): void;
    private renderByCamera;
    clearData(): void;
    clearScreen(hexColor: string): void;
}
