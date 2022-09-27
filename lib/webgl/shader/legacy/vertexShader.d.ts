export declare const legacyVertexShader = "precision mediump float;\n\nattribute vec2 positionCoords;\nattribute vec2 textureCoords;\n\nvarying vec2 texCoords;\n\nuniform mat4 projectionMatrix;\nuniform mat4 modelMatrix;\nuniform mat4 textureMatrix;\n\nvoid main()\n{\n    gl_Position = projectionMatrix * modelMatrix * vec4(positionCoords, 0, 1);\n    texCoords = (textureMatrix * vec4(textureCoords, 0, 1)).xy;\n}";
