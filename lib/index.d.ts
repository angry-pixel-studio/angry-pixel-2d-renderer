import { IRenderManager } from "./RenderManager";
export { IRenderManager } from "./RenderManager";
export * from "./CameraData";
export * from "./renderData/GeometricRenderData";
export * from "./renderData/MaskRenderData";
export * from "./renderData/RenderData";
export * from "./renderData/SpriteRenderData";
export * from "./renderData/TextRenderData";
export { TilemapOrientation, ITilemapRenderData } from "./renderData/TilemapRenderData";
export declare const renderManagerFactory: (canvas: HTMLCanvasElement) => IRenderManager;
