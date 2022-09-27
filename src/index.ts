import { Rectangle, Vector2 } from "angry-pixel-math";
import { ICameraData } from "./rendering/CameraData";
import { GeometricShape, IGeometricRenderData } from "./rendering/renderData/GeometricRenderData";
import { IMaskRenderData } from "./rendering/renderData/MaskRenderData";
import { RenderDataType, RenderLocation } from "./rendering/renderData/RenderData";
import { ISpriteRenderData } from "./rendering/renderData/SpriteRenderData";
import { ITextRenderData, TextOrientation } from "./rendering/renderData/TextRenderData";
import { ITilemapRenderData } from "./rendering/renderData/TilemapRenderData";
import { IRenderManager, RenderManager } from "./rendering/RenderManager";
import { ContextManager } from "./rendering/webgl/ContextManager";
import { FontAtlasFactory } from "./rendering/webgl/FontAtlasFactory";
import { ProgramFactory } from "./rendering/webgl/program/ProgramFactory";
import { ProgramManager } from "./rendering/webgl/program/ProgramManager";
import { ShaderLoader } from "./rendering/webgl/program/ShaderLoader";
import { GeometricRenderer } from "./rendering/webgl/renderer/GeometricRenderer";
import { IRenderer } from "./rendering/webgl/renderer/IRenderer";
import { MaskRenderer } from "./rendering/webgl/renderer/MaskRenderer";
import { SpriteRenderer } from "./rendering/webgl/renderer/SpriteRenderer";
import { TextRenderer } from "./rendering/webgl/renderer/TextRenderer";
import { TilemapRenderer } from "./rendering/webgl/renderer/TilemapRenderer";
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
            [RenderDataType.Tilemap, new TilemapRenderer(gl, programManager, textureManager)],
            [RenderDataType.Geometric, new GeometricRenderer(gl, programManager)],
            [RenderDataType.Mask, new MaskRenderer(gl, programManager)],
        ])
    );

    return new RenderManager(webglManager);
};

const renderManager: IRenderManager = renderManagerFactory(
    document.querySelector<HTMLCanvasElement>("#angry-pixel-canvas")
);

renderManager.addCameraData({
    depth: 1,
    layers: ["default", "tilemap", "player", "geometric"],
    positionInWorldSpace: new Vector2(0, 0),
    viewportRect: new Rectangle(-960, -540, 1920, 1080),
    zoom: 1,
} as ICameraData);

renderManager.addCameraData({
    depth: 2,
    layers: ["player2"],
    positionInWorldSpace: new Vector2(0, 0),
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
        position: new Vector2(0, 0),
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
        text: "Hola que tal\nComo estas",
        type: RenderDataType.Text,
        width: 400,
        orientation: TextOrientation.Center,
        color: "#FF3355",
    });
});

const tilemap = new Image();
tilemap.crossOrigin = "";
tilemap.src = "image/tileset/tileset.png";

tilemap.addEventListener("load", () => {
    renderManager.addRenderData<ITilemapRenderData>({
        type: RenderDataType.Tilemap,
        position: new Vector2(-300, -200),
        location: RenderLocation.WorldSpace,
        layer: "tilemap",
        image: tilemap,
        smooth: false,
        tilemap: {
            width: 6,
            tileWidth: 160,
            tileHeight: 160,
        },
        tileset: {
            width: 12,
            tileWidth: 16,
            tileHeight: 16,
        },
        tiles: [1, 3, 0, 0, 1, 3, 13, 28, 2, 2, 30, 15, 25, 26, 26, 26, 26, 27],
        // rotation: Math.PI / 8,
    });
});

renderManager.addRenderData<IGeometricRenderData>({
    type: RenderDataType.Geometric,
    location: RenderLocation.WorldSpace,
    layer: "geometric",
    position: new Vector2(0, 0),
    shape: GeometricShape.Polygon,
    rotation: Math.PI / 8,
    radius: 0,
    color: "#00FF00",
    vertexModel: [
        new Vector2(-50, -50),
        new Vector2(50, -50),
        new Vector2(100, 50),
        new Vector2(0, 0),
        new Vector2(-100, 50),
    ],
});

renderManager.addRenderData<IMaskRenderData>({
    type: RenderDataType.Mask,
    location: RenderLocation.WorldSpace,
    layer: "geometric",
    position: new Vector2(300, 0),
    color: "#0000FF",
    height: 400,
    width: 200,
});

setTimeout(() => {
    renderManager.clearScreen("#d3d3d3");
    renderManager.render();
}, 1000);

/*

tiled example

const dec2bin = (i: number) => (i >>> 0).toString(2);

let global_tile_id = 1610612908;

const FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
const FLIPPED_VERTICALLY_FLAG = 0x40000000;
const FLIPPED_DIAGONALLY_FLAG = 0x20000000;
const ROTATED_HEXAGONAL_120_FLAG = 0x10000000;

const flipped_horizontally = Boolean(global_tile_id & FLIPPED_HORIZONTALLY_FLAG);
const flipped_vertically = Boolean(global_tile_id & FLIPPED_VERTICALLY_FLAG);
const flipped_diagonally = Boolean(global_tile_id & FLIPPED_DIAGONALLY_FLAG);
const rotated_hex120 = Boolean(global_tile_id & ROTATED_HEXAGONAL_120_FLAG);

// Clear all four flags
const id =
    global_tile_id &
    ~(FLIPPED_HORIZONTALLY_FLAG | FLIPPED_VERTICALLY_FLAG | FLIPPED_DIAGONALLY_FLAG | ROTATED_HEXAGONAL_120_FLAG);

console.log(id, dec2bin(global_tile_id), flipped_horizontally, flipped_vertically, flipped_diagonally, rotated_hex120);

*/
