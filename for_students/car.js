/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { BoxGeometry } from "../libs/CS559-Three/build/three.module.js";

let windTex = new T.TextureLoader().load("./images/Wind.jpg");
let windTexbw = new T.TextureLoader().load("./images/Wind_bw.jpg");

let carFrontTex = new T.TextureLoader().load("./images/CarFront.jpg");
let carFrontTexbw = new T.TextureLoader().load("./images/CarFront_bw.jpg");

// define your vehicles here - remember, they need to be imported
// into the "main" program
export class GrCar extends GrObject{
    constructor(params = {}) {
        let car = new T.Group();
        
        let basicMat = new T.MeshStandardMaterial({color:"red",metalness:0.8,roughness:0.2});

        let baseGeom = new BoxGeometry(0.4,0.25,0.4);
        let base = new T.Mesh(baseGeom,basicMat);
        car.add(base);

        let frontGeom = new BoxGeometry(0.4,0.20,0.24);
        let front = new T.Mesh(frontGeom,basicMat);
        front.position.y = -0.025;
        front.position.z = 0.32;
        car.add(front);

        let topGeom = new BoxGeometry(0.4,0.15,0.26);
        let top = new T.Mesh(topGeom,basicMat);
        top.position.y = 0.125 + 0.075;
        top.position.z = 0;
        car.add(top);

        let windPoints = [[0,0.15,-0.07],[0.4,0.15,-0.07],[0.4,0,0],[0,0,0],[0,0,-0.07],[0.4,0,-0.07]];
        let windGeom = new T.BufferGeometry();
        let windMat = new T.MeshStandardMaterial({color:"white",map:windTex});
        let windVerts = new Float32Array([
            // Bottom
            windPoints[2][0],windPoints[2][1],windPoints[2][2],windPoints[4][0],windPoints[4][1],windPoints[4][2],windPoints[3][0],windPoints[3][1],windPoints[3][2],
            windPoints[2][0],windPoints[2][1],windPoints[2][2],windPoints[5][0],windPoints[5][1],windPoints[5][2],windPoints[4][0],windPoints[4][1],windPoints[4][2],

            // Top
            windPoints[2][0],windPoints[2][1],windPoints[2][2],windPoints[1][0],windPoints[1][1],windPoints[1][2],windPoints[0][0],windPoints[0][1],windPoints[0][2],
            windPoints[2][0],windPoints[2][1],windPoints[2][2],windPoints[0][0],windPoints[0][1],windPoints[0][2],windPoints[3][0],windPoints[3][1],windPoints[3][2],

            // Left
            windPoints[3][0],windPoints[3][1],windPoints[3][2],windPoints[0][0],windPoints[0][1],windPoints[0][2],windPoints[4][0],windPoints[4][1],windPoints[4][2],
            
            // Back
            windPoints[4][0],windPoints[4][1],windPoints[4][2],windPoints[0][0],windPoints[0][1],windPoints[0][2],windPoints[1][0],windPoints[1][1],windPoints[1][2],
            windPoints[4][0],windPoints[4][1],windPoints[4][2],windPoints[1][0],windPoints[1][1],windPoints[1][2],windPoints[5][0],windPoints[5][1],windPoints[5][2],

            // Right
            windPoints[5][0],windPoints[5][1],windPoints[5][2],windPoints[1][0],windPoints[1][1],windPoints[1][2],windPoints[2][0],windPoints[2][1],windPoints[2][2],
        ]);
        windGeom.setAttribute("position",new T.BufferAttribute(windVerts,3));
        windGeom.computeVertexNormals();
        let uvs = new Float32Array([
            1,0,
            0,1,
            0,0,

            1,0,
            1,1,
            0,1,

            1,0,
            1,1,
            0,1,

            1,0,
            0,1,
            0,0,

            1,0,
            0,1,
            0,0,

            1,0,
            1,1,
            0,1,

            1,0,
            0,1,
            0,0,

            1,0,
            1,1,
            0,0,
        ]);
        windGeom.setAttribute("uv",new T.BufferAttribute(uvs,2));
        let wind = new T.Mesh(windGeom,windMat);
        wind.position.z = 0.2;
        wind.position.x = -0.2;
        wind.position.y = 0.125;
        car.add(wind);

        let hoodGeom = new T.BufferGeometry();
        let hoodPoints = [[0,0.05,-0.24],[0.4,0.05,-0.24],[0.4,0,0],[0,0,0],[0,0,-0.24],[0.4,0,-0.24]];
        let hoodVerts = new Float32Array([
            // Bottom
            hoodPoints[2][0],hoodPoints[2][1],hoodPoints[2][2],hoodPoints[4][0],hoodPoints[4][1],hoodPoints[4][2],hoodPoints[3][0],hoodPoints[3][1],hoodPoints[3][2],
            hoodPoints[2][0],hoodPoints[2][1],hoodPoints[2][2],hoodPoints[5][0],hoodPoints[5][1],hoodPoints[5][2],hoodPoints[4][0],hoodPoints[4][1],hoodPoints[4][2],

            // Top
            hoodPoints[2][0],hoodPoints[2][1],hoodPoints[2][2],hoodPoints[1][0],hoodPoints[1][1],hoodPoints[1][2],hoodPoints[0][0],hoodPoints[0][1],hoodPoints[0][2],
            hoodPoints[2][0],hoodPoints[2][1],hoodPoints[2][2],hoodPoints[0][0],hoodPoints[0][1],hoodPoints[0][2],hoodPoints[3][0],hoodPoints[3][1],hoodPoints[3][2],

            // Left
            hoodPoints[3][0],hoodPoints[3][1],hoodPoints[3][2],hoodPoints[0][0],hoodPoints[0][1],hoodPoints[0][2],hoodPoints[4][0],hoodPoints[4][1],hoodPoints[4][2],
            
            // Back
            hoodPoints[4][0],hoodPoints[4][1],hoodPoints[4][2],hoodPoints[0][0],hoodPoints[0][1],hoodPoints[0][2],hoodPoints[1][0],hoodPoints[1][1],hoodPoints[1][2],
            hoodPoints[4][0],hoodPoints[4][1],hoodPoints[4][2],hoodPoints[1][0],hoodPoints[1][1],hoodPoints[1][2],hoodPoints[5][0],hoodPoints[5][1],hoodPoints[5][2],

            // Right
            hoodPoints[5][0],hoodPoints[5][1],hoodPoints[5][2],hoodPoints[1][0],hoodPoints[1][1],hoodPoints[1][2],hoodPoints[2][0],hoodPoints[2][1],hoodPoints[2][2],
        ]);
        hoodGeom.setAttribute("position",new T.BufferAttribute(hoodVerts,3));
        hoodGeom.computeVertexNormals();
        let hood = new T.Mesh(hoodGeom,basicMat);
        hood.position.z = 0.44;
        hood.position.y = 0.075;
        hood.position.x = -0.2;
        car.add(hood);

        let frontVentGeom = new T.BoxGeometry(0.34, 0.10,0.01);
        let frontVentMat = new T.MeshStandardMaterial({color:"white",map:carFrontTex});
        let frontVent = new T.Mesh(frontVentGeom,frontVentMat);
        frontVent.position.z = 0.44;
        frontVent.position.y = -0.025;
        car.add(frontVent);

        let backGeom = new T.BoxGeometry(0.4,0.25,0.3);
        let back = new T.Mesh(backGeom,basicMat);
        back.position.z = -0.35;
        car.add(back);

        let wheelGeom = new T.CylinderBufferGeometry(0.1,0.1,0.05);
        let wheelMat = new T.MeshStandardMaterial({color:"black"});

        let wheel1Rot = new T.Group();
        let wheel1 = new T.Mesh(wheelGeom,wheelMat);
        wheel1.rotateZ(Math.PI/2);
        wheel1Rot.add(wheel1);
        wheel1Rot.position.z = 0.22;
        wheel1Rot.position.x = 0.22;
        wheel1Rot.position.y = -0.105;
        car.add(wheel1Rot);

        let wheel2Rot = wheel1Rot.clone();
        wheel2Rot.position.x = -0.22;
        car.add(wheel2Rot);

        let wheel3Rot = wheel1Rot.clone();
        wheel3Rot.position.z = -0.32;
        car.add(wheel3Rot);

        let wheel4Rot = wheel3Rot.clone();
        wheel4Rot.position.x = -0.22;
        car.add(wheel4Rot);

        super("car",car);
        car.position.x = params.x ? Number(params.x) : 0;
        car.position.y = params.y ? Number(params.y) + 0.21 : 0.21;
        car.position.z = params.z ? Number(params.z) : 0;
        car.rotation.x = params.rx ? Number(params.rx) : 0;
        car.rotation.y = params.ry ? Number(params.ry) : 0;
        car.rotation.z = params.rz ? Number(params.rz) : 0;
        let scale = params.size ? Number(params.size) : 1;
        car.scale.set(scale, scale, scale);
    }
}

export class GrCar_bw extends GrObject{
    constructor(params = {}) {
        let car = new T.Group();
        
        let basicMat = new T.MeshStandardMaterial({color:"grey",metalness:0.8,roughness:0.2});

        let baseGeom = new BoxGeometry(0.4,0.25,0.4);
        let base = new T.Mesh(baseGeom,basicMat);
        car.add(base);

        let frontGeom = new BoxGeometry(0.4,0.20,0.24);
        let front = new T.Mesh(frontGeom,basicMat);
        front.position.y = -0.025;
        front.position.z = 0.32;
        car.add(front);

        let topGeom = new BoxGeometry(0.4,0.15,0.26);
        let top = new T.Mesh(topGeom,basicMat);
        top.position.y = 0.125 + 0.075;
        top.position.z = 0;
        car.add(top);

        let windPoints = [[0,0.15,-0.07],[0.4,0.15,-0.07],[0.4,0,0],[0,0,0],[0,0,-0.07],[0.4,0,-0.07]];
        let windGeom = new T.BufferGeometry();
        let windMat = new T.MeshStandardMaterial({color:"white",map:windTexbw});
        let windVerts = new Float32Array([
            // Bottom
            windPoints[2][0],windPoints[2][1],windPoints[2][2],windPoints[4][0],windPoints[4][1],windPoints[4][2],windPoints[3][0],windPoints[3][1],windPoints[3][2],
            windPoints[2][0],windPoints[2][1],windPoints[2][2],windPoints[5][0],windPoints[5][1],windPoints[5][2],windPoints[4][0],windPoints[4][1],windPoints[4][2],

            // Top
            windPoints[2][0],windPoints[2][1],windPoints[2][2],windPoints[1][0],windPoints[1][1],windPoints[1][2],windPoints[0][0],windPoints[0][1],windPoints[0][2],
            windPoints[2][0],windPoints[2][1],windPoints[2][2],windPoints[0][0],windPoints[0][1],windPoints[0][2],windPoints[3][0],windPoints[3][1],windPoints[3][2],

            // Left
            windPoints[3][0],windPoints[3][1],windPoints[3][2],windPoints[0][0],windPoints[0][1],windPoints[0][2],windPoints[4][0],windPoints[4][1],windPoints[4][2],
            
            // Back
            windPoints[4][0],windPoints[4][1],windPoints[4][2],windPoints[0][0],windPoints[0][1],windPoints[0][2],windPoints[1][0],windPoints[1][1],windPoints[1][2],
            windPoints[4][0],windPoints[4][1],windPoints[4][2],windPoints[1][0],windPoints[1][1],windPoints[1][2],windPoints[5][0],windPoints[5][1],windPoints[5][2],

            // Right
            windPoints[5][0],windPoints[5][1],windPoints[5][2],windPoints[1][0],windPoints[1][1],windPoints[1][2],windPoints[2][0],windPoints[2][1],windPoints[2][2],
        ]);
        windGeom.setAttribute("position",new T.BufferAttribute(windVerts,3));
        windGeom.computeVertexNormals();
        let uvs = new Float32Array([
            1,0,
            0,1,
            0,0,

            1,0,
            1,1,
            0,1,

            1,0,
            1,1,
            0,1,

            1,0,
            0,1,
            0,0,

            1,0,
            0,1,
            0,0,

            1,0,
            1,1,
            0,1,

            1,0,
            0,1,
            0,0,

            1,0,
            1,1,
            0,0,
        ]);
        windGeom.setAttribute("uv",new T.BufferAttribute(uvs,2));
        let wind = new T.Mesh(windGeom,windMat);
        wind.position.z = 0.2;
        wind.position.x = -0.2;
        wind.position.y = 0.125;
        car.add(wind);

        let hoodGeom = new T.BufferGeometry();
        let hoodPoints = [[0,0.05,-0.24],[0.4,0.05,-0.24],[0.4,0,0],[0,0,0],[0,0,-0.24],[0.4,0,-0.24]];
        let hoodVerts = new Float32Array([
            // Bottom
            hoodPoints[2][0],hoodPoints[2][1],hoodPoints[2][2],hoodPoints[4][0],hoodPoints[4][1],hoodPoints[4][2],hoodPoints[3][0],hoodPoints[3][1],hoodPoints[3][2],
            hoodPoints[2][0],hoodPoints[2][1],hoodPoints[2][2],hoodPoints[5][0],hoodPoints[5][1],hoodPoints[5][2],hoodPoints[4][0],hoodPoints[4][1],hoodPoints[4][2],

            // Top
            hoodPoints[2][0],hoodPoints[2][1],hoodPoints[2][2],hoodPoints[1][0],hoodPoints[1][1],hoodPoints[1][2],hoodPoints[0][0],hoodPoints[0][1],hoodPoints[0][2],
            hoodPoints[2][0],hoodPoints[2][1],hoodPoints[2][2],hoodPoints[0][0],hoodPoints[0][1],hoodPoints[0][2],hoodPoints[3][0],hoodPoints[3][1],hoodPoints[3][2],

            // Left
            hoodPoints[3][0],hoodPoints[3][1],hoodPoints[3][2],hoodPoints[0][0],hoodPoints[0][1],hoodPoints[0][2],hoodPoints[4][0],hoodPoints[4][1],hoodPoints[4][2],
            
            // Back
            hoodPoints[4][0],hoodPoints[4][1],hoodPoints[4][2],hoodPoints[0][0],hoodPoints[0][1],hoodPoints[0][2],hoodPoints[1][0],hoodPoints[1][1],hoodPoints[1][2],
            hoodPoints[4][0],hoodPoints[4][1],hoodPoints[4][2],hoodPoints[1][0],hoodPoints[1][1],hoodPoints[1][2],hoodPoints[5][0],hoodPoints[5][1],hoodPoints[5][2],

            // Right
            hoodPoints[5][0],hoodPoints[5][1],hoodPoints[5][2],hoodPoints[1][0],hoodPoints[1][1],hoodPoints[1][2],hoodPoints[2][0],hoodPoints[2][1],hoodPoints[2][2],
        ]);
        hoodGeom.setAttribute("position",new T.BufferAttribute(hoodVerts,3));
        hoodGeom.computeVertexNormals();
        let hood = new T.Mesh(hoodGeom,basicMat);
        hood.position.z = 0.44;
        hood.position.y = 0.075;
        hood.position.x = -0.2;
        car.add(hood);

        let frontVentGeom = new T.BoxGeometry(0.34, 0.10,0.01);
        let frontVentMat = new T.MeshStandardMaterial({color:"white",map:carFrontTexbw});
        let frontVent = new T.Mesh(frontVentGeom,frontVentMat);
        frontVent.position.z = 0.44;
        frontVent.position.y = -0.025;
        car.add(frontVent);

        let backGeom = new T.BoxGeometry(0.4,0.25,0.3);
        let back = new T.Mesh(backGeom,basicMat);
        back.position.z = -0.35;
        car.add(back);

        let wheelGeom = new T.CylinderBufferGeometry(0.1,0.1,0.05);
        let wheelMat = new T.MeshStandardMaterial({color:"black"});

        let wheel1Rot = new T.Group();
        let wheel1 = new T.Mesh(wheelGeom,wheelMat);
        wheel1.rotateZ(Math.PI/2);
        wheel1Rot.add(wheel1);
        wheel1Rot.position.z = 0.22;
        wheel1Rot.position.x = 0.22;
        wheel1Rot.position.y = -0.105;
        car.add(wheel1Rot);

        let wheel2Rot = wheel1Rot.clone();
        wheel2Rot.position.x = -0.22;
        car.add(wheel2Rot);

        let wheel3Rot = wheel1Rot.clone();
        wheel3Rot.position.z = -0.32;
        car.add(wheel3Rot);

        let wheel4Rot = wheel3Rot.clone();
        wheel4Rot.position.x = -0.22;
        car.add(wheel4Rot);

        super("car",car);
        car.position.x = params.x ? Number(params.x) : 0;
        car.position.y = params.y ? Number(params.y) + 0.21 : 0.21;
        car.position.z = params.z ? Number(params.z) : 0;
        car.rotation.x = params.rx ? Number(params.rx) : 0;
        car.rotation.y = params.ry ? Number(params.ry) : 0;
        car.rotation.z = params.rz ? Number(params.rz) : 0;
        let scale = params.size ? Number(params.size) : 1;
        car.scale.set(scale, scale, scale);
    }
}
