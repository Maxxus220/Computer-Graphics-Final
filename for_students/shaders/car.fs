in vec4 xy;

void main() {
    vec4 color = xy;
    gl_FragColor = mix(vec4(0.07,0.07,0.07,1.),xy,step(0.,xy.x));
}