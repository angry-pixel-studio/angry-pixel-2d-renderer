import { mat4 } from "gl-matrix";
import { ICameraData } from "../../CameraData";
import { RenderLocation } from "../../renderData/RenderData";

export const setProjectionMatrix = (
    projectionMatrix: mat4,
    cameraData: ICameraData,
    renderLocation: RenderLocation
): void => {
    projectionMatrix = mat4.identity(projectionMatrix);
    mat4.ortho(
        projectionMatrix,
        cameraData.viewportRect.x,
        cameraData.viewportRect.x1,
        cameraData.viewportRect.y,
        cameraData.viewportRect.y1,
        -1,
        1
    );

    if (renderLocation === RenderLocation.WorldSpace) {
        mat4.scale(projectionMatrix, projectionMatrix, [cameraData.zoom ?? 1, cameraData.zoom ?? 1, 1]);
        mat4.translate(projectionMatrix, projectionMatrix, [
            -cameraData.positionInWorldSpace.x,
            -cameraData.positionInWorldSpace.y,
            0,
        ]);
    } else {
        mat4.translate(projectionMatrix, projectionMatrix, [0, 0, 0]);
    }
};
