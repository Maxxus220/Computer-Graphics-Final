// @ts-check

import * as T from "./CS559-Three/build/three.module.js";
import { GrObject } from "./CS559-Framework/GrObject.js";

let customRectObCtr = 0;

/**
 * Creates a rectangle with 2 triangles per side
 * Triangles are in order front, left, back, right, top, bottom 
 * always going bottom right triangle to top left and starting triangles in corners at right angles
 * Takes 5 additional parameters. l,w,h,mat,slider
 * Slider is formatted [[minRange,maxRange,start],[minRange,maxRange,start]] for x then z
 * Is centered at the middle of the rectangle
 */
export class GrCustomRect extends GrObject{
    constructor(params = {}) {
        let customRectGeom = new T.BufferGeometry();
        let l = params.l / 2;
        let w = params.w / 2;
        let h = params.h / 2;
        let points = [[w,-h,l],[w,h,l],[-w,-h,l],[-w,h,l],[w,-h,-l],[w,h,-l],[-w,-h,-l],[-w,h,-l]];
        let vertices = new Float32Array([
            // front
            points[0][0],points[0][1],points[0][2],points[1][0],points[1][1],points[1][2],points[2][0],points[2][1],points[2][2],
            points[3][0],points[3][1],points[3][2],points[2][0],points[2][1],points[2][2],points[1][0],points[1][1],points[1][2],

            // left
            points[2][0],points[2][1],points[2][2],points[3][0],points[3][1],points[3][2],points[6][0],points[6][1],points[6][2],
            points[7][0],points[7][1],points[7][2],points[6][0],points[6][1],points[6][2],points[3][0],points[3][1],points[3][2],

            // back
            points[6][0],points[6][1],points[6][2],points[7][0],points[7][1],points[7][2],points[4][0],points[4][1],points[4][2],
            points[5][0],points[5][1],points[5][2],points[4][0],points[4][1],points[4][2],points[7][0],points[7][1],points[7][2],

            // right
            points[4][0],points[4][1],points[4][2],points[5][0],points[5][1],points[5][2],points[0][0],points[0][1],points[0][2],
            points[1][0],points[1][1],points[1][2],points[0][0],points[0][1],points[0][2],points[5][0],points[5][1],points[5][2],

            // top
            points[1][0],points[1][1],points[1][2],points[5][0],points[5][1],points[5][2],points[3][0],points[3][1],points[3][2],
            points[7][0],points[7][1],points[7][2],points[3][0],points[3][1],points[3][2],points[5][0],points[5][1],points[5][2],

            // bottom
            points[4][0],points[4][1],points[4][2],points[0][0],points[0][1],points[0][2],points[6][0],points[6][1],points[6][2],
            points[2][0],points[2][1],points[2][2],points[6][0],points[6][1],points[6][2],points[0][0],points[0][1],points[0][2]
        ]);
        customRectGeom.setAttribute("position",new T.BufferAttribute(vertices,3));

        let uvs = new Float32Array([
            1,0,1,1,0,0,0,1,0,0,1,1,
            1,0,1,1,0,0,0,1,0,0,1,1,
            1,0,1,1,0,0,0,1,0,0,1,1,
            1,0,1,1,0,0,0,1,0,0,1,1,
            1,0,1,1,0,0,0,1,0,0,1,1,
            1,0,1,1,0,0,0,1,0,0,1,1
        ]);
        customRectGeom.setAttribute("uv",new T.BufferAttribute(uvs,2));

        customRectGeom.computeVertexNormals();

        let customRect = new T.Mesh(customRectGeom,params.mat);

        if(params.slider != null) super(`CustomRect-${customRectObCtr++}`,customRect,[
        ["x",params.slider[0][0],params.slider[0][1],params.slider[0][2]],
        ["z",params.slider[1][0],params.slider[1][1],params.slider[1][2]]
        ]);
        else super(`CustomRect-${customRectObCtr++}`,customRect);
        customRect.position.x = params.x ? Number(params.x) : 0;
        customRect.position.y = params.y ? Number(params.y) + 1 : 1;
        customRect.position.z = params.z ? Number(params.z) : 0;
        customRect.rotation.x = params.rx ? Number(params.rx) : 0;
        customRect.rotation.y = params.ry ? Number(params.ry) : 0;
        customRect.rotation.z = params.rz ? Number(params.rz) : 0;
        let scale = params.size ? Number(params.size) : 1;
        customRect.scale.set(scale, scale, scale);

        this.rect = customRect;
    }

    update(paramValues) {
        this.rect.position.x = paramValues[0];
        this.rect.position.z = paramValues[1];
      }
}