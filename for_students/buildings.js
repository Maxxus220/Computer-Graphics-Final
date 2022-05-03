/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

// define your buildings here - remember, they need to be imported
// into the "main" program
let brickTex = new T.TextureLoader().load("./images/2ch-brick.jpg");
let building1Tex = new T.TextureLoader().load("./images/TopTex.jpg");
let doorTex = new T.TextureLoader().load("./images/DoorTex.jpg");
let tanBrickTex = new T.TextureLoader().load("./images/TanBrick.jpg");
let gravelRoofTex = new T.TextureLoader().load("./images/GravelRoof.jpg");
let doubleDoorTex = new T.TextureLoader().load("./images/DoubleWoodDoor.jpg");
let windowTex = new T.TextureLoader().load("./images/Window.jpg");
let bushTex = new T.TextureLoader().load("./images/Bush.jpg");

export class GrBuilding1 extends GrObject {
    constructor(params = {}) {
        let building1 = new T.Group();

        let brickMat = new T.MeshStandardMaterial({color:"white",map:brickTex});
        let baseGeom = new T.BoxGeometry(2,1,1);
        let base = new T.Mesh(baseGeom,brickMat);
        building1.add(base);

        let buildTopGeom = new T.BufferGeometry();
        let buildTopMat = new T.MeshStandardMaterial({color:"white",map:building1Tex});

        let points = [[1,0,-0.5],[-1,0,-0.5],[-1,0,0.5],[1,0,0.5],[1,0.5,0.5],[-1,0.5,0.5]];

        let vertices = new Float32Array([
            // Bottom
            points[0][0],points[0][1],points[0][2],points[3][0],points[3][1],points[3][2],points[2][0],points[2][1],points[2][2],
            points[0][0],points[0][1],points[0][2],points[2][0],points[2][1],points[2][2],points[1][0],points[1][1],points[1][2],

            // Right
            points[0][0],points[0][1],points[0][2],points[4][0],points[4][1],points[4][2],points[3][0],points[3][1],points[3][2],

            // Left
            points[2][0],points[2][1],points[2][2],points[5][0],points[5][1],points[5][2],points[1][0],points[1][1],points[1][2],

            // Front
            points[3][0],points[3][1],points[3][2],points[4][0],points[4][1],points[4][2],points[5][0],points[5][1],points[5][2],
            points[3][0],points[3][1],points[3][2],points[5][0],points[5][1],points[5][2],points[2][0],points[2][1],points[2][2],

            // Top
            points[1][0],points[1][1],points[1][2],points[5][0],points[5][1],points[5][2],points[0][0],points[0][1],points[0][2],
            points[0][0],points[0][1],points[0][2],points[5][0],points[5][1],points[5][2],points[4][0],points[4][1],points[4][2],
        ])
        buildTopGeom.setAttribute("position",new T.BufferAttribute(vertices,3));

        buildTopGeom.computeVertexNormals();

        let uvs = new Float32Array([
            90/570,90/360,
            90/570,0,
            0,0,

            90/570,90/360,
            0,0,
            0,90/360,

            90/570,0,
            0,90/360,
            0,0,

            90/570,0,
            90/570,90/360,
            0,0,

            90/570,0,
            90/570,90/360,
            0,90/360,

            90/570,0,
            0,90/360,
            0,0,

            1,0,
            1,1,
            90/570,0,

            90/570,0,
            1,1,
            90/570,1,
        ]);
        buildTopGeom.setAttribute("uv",new T.BufferAttribute(uvs,2));

        let buildTop = new T.Mesh(buildTopGeom,buildTopMat);
        buildTop.position.y = 0.5;

        building1.add(buildTop);

        let doorGeom = new T.BoxGeometry(0.3, 0.6, 0.05);
        let doorMat = new T.MeshStandardMaterial({color:"white",map:doorTex});
        let door = new T.Mesh(doorGeom,doorMat);
        door.position.z = 0.48;
        door.position.y = -0.2;

        building1.add(door);


        super("Building1",building1);
        building1.position.x = params.x ? Number(params.x) : 0;
        building1.position.y = params.y ? Number(params.y) + 0.5 : 0.5;
        building1.position.z = params.z ? Number(params.z) : 0;
        building1.rotation.x = params.rx ? Number(params.rx) : 0;
        building1.rotation.y = params.ry ? Number(params.ry) : 0;
        building1.rotation.z = params.rz ? Number(params.rz) : 0;
        let scale = params.size ? Number(params.size) : 1;
        building1.scale.set(scale, scale, scale);
    }
}

export class GrBuilding2 extends GrObject {
    constructor(params = {}) {
        let building2 = new T.Group();

        let baseGeom = new T.BoxGeometry(2,2,1);
        let baseMat = new T.MeshStandardMaterial({color:"white",map:tanBrickTex});
        let base = new T.Mesh(baseGeom,baseMat);
        building2.add(base);

        let roofGeom = new T.BoxGeometry(2.2,0.2,1.2);
        let roofMat = new T.MeshStandardMaterial({color:"white",map:gravelRoofTex});
        let roof = new T.Mesh(roofGeom,roofMat);
        roof.position.y = 1.1;
        building2.add(roof);

        let doorGeom = new T.BoxGeometry(0.6, 0.6, 0.05);
        let doorMat = new T.MeshStandardMaterial({color:"white",map:doubleDoorTex});
        let door = new T.Mesh(doorGeom,doorMat);
        door.position.y = -0.7;
        door.position.z = 0.48;
        building2.add(door);

        let windowGeom = new T.BoxGeometry(0.2,0.4,0.05);
        let windowMat = new T.MeshStandardMaterial({color:"white",map:windowTex});

        let window1 = new T.Mesh(windowGeom,windowMat);
        let window2 = window1.clone();
        let window3 = window1.clone();
        let window4 = window1.clone();
        let window5 = window1.clone();
        let window6 = window1.clone();
        window1.position.set(-0.5,0,0.48);
        window2.position.set(0,0,0.48);
        window3.position.set(0.5,0,0.48);
        window4.position.set(-0.5,0.5,0.48);
        window5.position.set(0,0.5,0.48);
        window6.position.set(0.5,0.5,0.48);

        let window7 = window1.clone();
        let window8 = window1.clone();
        let window9 = window1.clone();
        let window10 = window1.clone();
        let window11 = window1.clone();
        let window12 = window1.clone();
        let window13 = window1.clone();
        let window14 = window1.clone();
        let window15 = window1.clone();
        window7.position.set(-0.5,0,-0.48);
        window8.position.set(0,0,-0.48);
        window9.position.set(0.5,0,-0.48);
        window10.position.set(-0.5,0.5,-0.48);
        window11.position.set(0,0.5,-0.48);
        window12.position.set(0.5,0.5,-0.48);
        window13.position.set(-0.5,-0.5,-0.48);
        window14.position.set(0,-0.5,-0.48);
        window15.position.set(0.5,-0.5,-0.48);

        building2.add(window1,window2,window3,window4,window5,window6,window7,window8,window9,window10,window11,window12,window13,window14,window15);

        super("Building2",building2);
        building2.position.x = params.x ? Number(params.x) : 0;
        building2.position.y = params.y ? Number(params.y) + 1 : 1;
        building2.position.z = params.z ? Number(params.z) : 0;
        building2.rotation.x = params.rx ? Number(params.rx) : 0;
        building2.rotation.y = params.ry ? Number(params.ry) : 0;
        building2.rotation.z = params.rz ? Number(params.rz) : 0;
        let scale = params.size ? Number(params.size) : 1;
        building2.scale.set(scale, scale, scale);
    }
}

export class GrBush extends GrObject{
    constructor(params = {}) {
        let bushGeom = new T.BoxGeometry(0.5,0.4,0.25);
        let bushMat = new T.MeshStandardMaterial({color:"white",map:bushTex});
        let bush = new T.Mesh(bushGeom,bushMat);

        super("Bush",bush);
        bush.position.x = params.x ? Number(params.x) : 0;
        bush.position.y = params.y ? Number(params.y) + 0.075 : 0.075;
        bush.position.z = params.z ? Number(params.z) : 0;
        bush.rotation.x = params.rx ? Number(params.rx) : 0;
        bush.rotation.y = params.ry ? Number(params.ry) : 0;
        bush.rotation.z = params.rz ? Number(params.rz) : 0;
        let scale = params.size ? Number(params.size) : 1;
        bush.scale.set(scale, scale, scale);
    }
}