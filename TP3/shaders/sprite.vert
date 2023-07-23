#ifdef  GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 coords;
varying vec2 textCoords;

uniform vec2 selectedSprite;
uniform vec2 spriteSheetSize;



void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    
    float width = spriteSheetSize.x; 
    float heigth = spriteSheetSize.y; 

    float dx = (selectedSprite.x + (aVertexPosition.x-0.5)*width) * width + (aTextureCoord.x) * width;
    float dy = (selectedSprite.y + (aVertexPosition.y-0.5)*heigth) * heigth + (aTextureCoord.y) * heigth;

    
    coords = vec2(dx,dy);
    
    
}