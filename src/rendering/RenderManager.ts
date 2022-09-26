import { ICameraData } from "./CameraData";
import { IRenderData } from "./renderData/RenderData";
import { IWebGLManager } from "./webgl/WebGLManager";

export interface IRenderManager {
    addRenderData<T extends IRenderData>(data: T): void;
    addCameraData(data: ICameraData): void;
    render(): void;
    clearData(): void;
    clearScreen(hexColor: string): void;
}

export class RenderManager implements IRenderManager {
    private renderData: IRenderData[] = [];
    private cameraData: ICameraData[] = [];

    public constructor(private readonly webglManager: IWebGLManager) {}

    public addRenderData<T extends IRenderData>(data: T): void {
        this.renderData.push(data);
    }

    public addCameraData(data: ICameraData): void {
        this.cameraData.push(data);
    }

    public render(): void {
        this.cameraData
            .sort((a: ICameraData, b: ICameraData) => a.depth - b.depth)
            .forEach((data: ICameraData) => this.renderByCamera(data));
    }

    private renderByCamera(cameraData: ICameraData): void {
        this.renderData
            .filter((renderData) => cameraData.layers.includes(renderData.layer))
            .sort((a, b) => cameraData.layers.indexOf(a.layer) - cameraData.layers.indexOf(b.layer))
            .forEach((renderData) => {
                this.webglManager.render(renderData, cameraData);
            });
    }

    public clearData(): void {
        this.renderData = [];
        this.cameraData = [];
    }

    public clearScreen(hexColor: string): void {
        this.webglManager.clearCanvas(hexColor);
    }
}
