out vec4 xy;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
    xy = modelMatrix * vec4(position,1.);
}