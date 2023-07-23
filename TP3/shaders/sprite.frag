#ifdef  GL_ES
precision highp float;
#endif

varying vec2 coords;
varying vec2 textCoords;

uniform sampler2D uSampler;



void main(){
    vec4 color = texture2D(uSampler, coords); 
    vec4 filter = texture2D(uSampler, vec2(0.0,0.1)+coords);

    gl_FragColor = color;
    
}