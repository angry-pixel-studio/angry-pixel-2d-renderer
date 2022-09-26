import { Rectangle } from "./math/Rectangle";
import { Vector2 } from "./math/Vector2";
import { ICameraData } from "./rendering/CameraData";
import { RenderDataType, RenderLocation } from "./rendering/renderData/RenderData";
import { ISpriteRenderData } from "./rendering/renderData/SpriteRenderData";
import { ITextRenderData, Orientation } from "./rendering/renderData/TextRenderData";
import { IRenderManager, RenderManager } from "./rendering/RenderManager";
import { ContextManager } from "./rendering/webgl/ContextManager";
import { FontAtlasFactory } from "./rendering/webgl/FontAtlasFactory";
import { ProgramFactory } from "./rendering/webgl/program/ProgramFactory";
import { ProgramManager } from "./rendering/webgl/program/ProgramManager";
import { ShaderLoader } from "./rendering/webgl/program/ShaderLoader";
import { IRenderer } from "./rendering/webgl/renderer/IRenderer";
import { SpriteRenderer } from "./rendering/webgl/renderer/SpriteRenderer";
import { TextRenderer } from "./rendering/webgl/renderer/TextRenderer";
import { TextureFactory } from "./rendering/webgl/texture/TextureFactory";
import { TextureManager } from "./rendering/webgl/texture/TextureManager";
import { WebGLManager } from "./rendering/webgl/WebGLManager";

const loadFont = async (family: string, url: string): Promise<FontFace> => {
    const font: FontFace = new FontFace(family, `url(${url})`);
    await font.load();
    // @ts-ignore
    document.fonts.add(font);

    return font;
};

const renderManagerFactory = (canvas: HTMLCanvasElement): IRenderManager => {
    const contextManager = new ContextManager(canvas);
    const gl = contextManager.gl;
    const contextVersion = contextManager.contextVersion;

    const programManager = new ProgramManager(gl, contextVersion, new ProgramFactory(gl, new ShaderLoader(gl)));
    const textureManager = new TextureManager(new TextureFactory(gl));

    const webglManager = new WebGLManager(
        gl,
        programManager,
        new Map<RenderDataType, IRenderer>([
            [RenderDataType.Sprite, new SpriteRenderer(gl, programManager, textureManager)],
            [RenderDataType.Text, new TextRenderer(gl, programManager, textureManager, new FontAtlasFactory())],
        ])
    );

    return new RenderManager(webglManager);
};

const renderManager: IRenderManager = renderManagerFactory(
    document.querySelector<HTMLCanvasElement>("#angry-pixel-canvas")
);

renderManager.addCameraData({
    depth: 1,
    layers: ["default", "player"],
    positionInWorldSpace: new Vector2(0, 0),
    viewportRect: new Rectangle(-960, -540, 1920, 1080),
    zoom: 1,
} as ICameraData);

renderManager.addCameraData({
    depth: 2,
    layers: ["player2"],
    positionInWorldSpace: new Vector2(-500, 0),
    viewportRect: new Rectangle(-960, -540, 1920, 1080),
    zoom: 1,
} as ICameraData);

const woodenPlate = new Image();
woodenPlate.crossOrigin = "";
woodenPlate.src = "image/misc/wooden_plate.png";

woodenPlate.addEventListener("load", () => {
    renderManager.addRenderData<ISpriteRenderData>({
        type: RenderDataType.Sprite,
        position: new Vector2(800, 400),
        location: RenderLocation.ViewPort,
        layer: "default",
        image: woodenPlate,
        width: 160,
        height: 160,
        smooth: false,
    });
});

const player = new Image();
player.crossOrigin = "";
player.src = "image/player/player-spritesheet.png";

player.addEventListener("load", () => {
    renderManager.addRenderData<ISpriteRenderData>({
        type: RenderDataType.Sprite,
        position: new Vector2(-500, 0),
        location: RenderLocation.WorldSpace,
        layer: "player",
        image: player,
        width: 160,
        height: 160,
        smooth: false,
        slice: { x: 0, y: 64, width: 16, height: 16 },
    });
});

player.addEventListener("load", () => {
    renderManager.addRenderData<ISpriteRenderData>({
        type: RenderDataType.Sprite,
        position: new Vector2(-500, 0),
        location: RenderLocation.WorldSpace,
        layer: "player2",
        image: player,
        width: 160,
        height: 160,
        smooth: false,
        slice: { x: 0, y: 32, width: 16, height: 16 },
        rotation: Math.PI,
    });
});

loadFont("PressStart2P-Regular", "font/PressStart2P-Regular.ttf").then((font) => {
    renderManager.addRenderData<ITextRenderData>({
        font,
        fontSize: 30,
        height: 300,
        layer: "default",
        location: RenderLocation.WorldSpace,
        position: new Vector2(-0, 400),
        smooth: true,
        text: "Hola que tal\nComo estas",
        type: RenderDataType.Text,
        width: 400,
        orientation: Orientation.Center,
        color: "#FF3355",
    });
});

setTimeout(() => {
    renderManager.clearScreen("#d3d3d3");
    renderManager.render();
}, 1000);
