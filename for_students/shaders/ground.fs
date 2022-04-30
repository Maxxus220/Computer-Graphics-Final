in vec2 v_uv;

void main() {
    vec4 color = vec4(v_uv.x * 0.65,smoothstep(0.,2.,v_uv.x+v_uv.y) * 0.9,v_uv.y,1.);
    gl_FragColor = mix(vec4(0.2,0.2,0.2,1.),color,step(0.5,v_uv.x));
}