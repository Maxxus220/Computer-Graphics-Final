/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

function degreesToRadians(deg) {
  return (deg * Math.PI) / 180;
}

let frontloaderObCtr = 0;

export class GrFrontLoader extends GrObject {
  constructor(params = {}) {
    let frontloader = new T.Group();

    let bodyMat = new T.MeshStandardMaterial({color: "yellow"});
    let mainBodyGeom = new T.BoxGeometry(1.5,1.5,1.5);
    let mainBody = new T.Mesh(mainBodyGeom, bodyMat);
    mainBody.position.y = 0.75;
    frontloader.add(mainBody);

    let armsRot = new T.Group();
    armsRot.position.y = 1.;
    armsRot.position.z = 0.5;
    
    let armGeom = new T.BoxGeometry(0.2, 0.3, 1.2);
    let arm1 = new T.Mesh(armGeom, bodyMat);
    let arm2 = arm1.clone();
    arm1.position.x = 0.85;
    arm1.position.z = 0.6;
    arm2.position.x = -0.85;
    arm2.position.z = 0.6
    armsRot.add(arm1);
    armsRot.add(arm2);

    armsRot.rotation.x = Math.PI/4;

    frontloader.add(armsRot);

    let loadRot = new T.Group();
    loadRot.rotation.x = -Math.PI/4;
    loadRot.position.z = 1.2;
    loadRot.position.y = -0.1;

    let loadMat = new T.MeshStandardMaterial({color: "grey"});
    let loadBaseGeom = new T.BoxGeometry(1.5,0.2,0.7);
    let loadBase = new T.Mesh(loadBaseGeom, loadMat);
    loadBase.position.z = 0.35;
    loadRot.add(loadBase);
    
    let loadSideGeom = new T.BoxGeometry(1.5, 0.7, 0.2);
    let loadSide = new T.Mesh(loadSideGeom, loadMat);
    loadSide.position.y = 0.35;
    loadRot.add(loadSide);

    armsRot.add(loadRot);

    let wheelGeom = new T.CylinderGeometry(0.3,0.3,0.2);
    let wheelMat = new T.MeshStandardMaterial({color: "black"});
    let wheel1 = new T.Mesh(wheelGeom, wheelMat);
    let wheel2 = wheel1.clone();
    let wheel3 = wheel1.clone();
    let wheel4 = wheel1.clone();
    let wheel5 = wheel1.clone();
    let wheel6 = wheel1.clone();
    wheel1.rotation.z = Math.PI/2;
    wheel1.position.x = 0.85;
    wheel1.position.y = 0.3;
    wheel2.rotation.z = Math.PI/2;
    wheel2.position.x = -0.85;
    wheel2.position.y = 0.3;
    wheel3.rotation.z = Math.PI/2;
    wheel3.position.x = 0.85;
    wheel3.position.y = 0.3;
    wheel3.position.z = 0.5;
    wheel4.rotation.z = Math.PI/2;
    wheel4.position.x = -0.85;
    wheel4.position.y = 0.3;
    wheel4.position.z = 0.5;
    wheel5.rotation.z = Math.PI/2;
    wheel5.position.x = 0.85;
    wheel5.position.y = 0.3;
    wheel5.position.z = -0.5;
    wheel6.rotation.z = Math.PI/2;
    wheel6.position.x = -0.85;
    wheel6.position.y = 0.3;
    wheel6.position.z = -0.5;

    frontloader.add(wheel1);
    frontloader.add(wheel2);
    frontloader.add(wheel3);
    frontloader.add(wheel4);
    frontloader.add(wheel5);
    frontloader.add(wheel6);

    super(`Frontloader-${frontloaderObCtr++}`,frontloader, [
      ["x",-20,20,0],
      ["z",-20,20,0],
      ["theta",0,360,0],
      ["arm_rotate",0,70,0],
      ["load_rotate",-65,20,0]
    ]);
    frontloader.position.x = params.x ? Number(params.x) : 0;
    frontloader.position.y = params.y ? Number(params.y) : 0;
    frontloader.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    frontloader.scale.set(scale, scale, scale);
    this.frontloader = frontloader;
    this.armRot = armsRot;
    this.loadRot = loadRot;
    this.time = 0;
  }

  update(paramValues) {
    this.frontloader.position.x = paramValues[0];
    this.frontloader.position.z = paramValues[1];
    this.frontloader.rotation.y = degreesToRadians(paramValues[2]);
    this.armRot.rotation.x = Math.PI/4 - degreesToRadians(paramValues[3]);  
    this.loadRot.rotation.x = -Math.PI/4 - degreesToRadians(paramValues[4]);
  }

  stepWorld(delta,timeofday) {
    this.time += delta;
    let t = (this.time/1000) % 8;
    if(t >= 0 && t < 2) {
      t = t/2;
      this.frontloader.position.x = (1-t) * 7 + t * 10;
      this.frontloader.position.z = (1-t) * -14 + t * -11;
    }
    else if(t >= 2 && t < 3) {
      t = t-2;
      this.armRot.rotation.x = (1-t) * Math.PI/4 + t * Math.PI/3.7;
      this.loadRot.rotation.x = (1-t) * -Math.PI/4 + t * -Math.PI/6
    }
    else if(t >= 3 && t < 4) {
      t = t-3;
      this.armRot.rotation.x = (1-t) * Math.PI/3.7 + t * Math.PI/10;
      this.loadRot.rotation.x = (1-t) * -Math.PI/6 + t * -Math.PI/3;
    }
    else if(t >= 4 && t < 6) {
      t = (t-4)/2;
      this.frontloader.position.x = (1-t) * 10 + t * 7;
      this.frontloader.position.z = (1-t) * -11 + t *  -14;
    }
    else if(t >= 6 && t < 7) {
      t = t-6;
      this.loadRot.rotation.x = (1-t) * -Math.PI/3 + t * Math.PI/14;
    }
    else if(t >= 7 && t < 8) {
      t = t-7;
      this.armRot.rotation.x = (1-t) * Math.PI/10 + t * Math.PI/4;
      this.loadRot.rotation.x = (1-t) * Math.PI/14 + t * -Math.PI/4;
    }
  }
}

export class GrFrontLoader_bw extends GrObject {
  constructor(params = {}) {
    let frontloader = new T.Group();

    let bodyMat = new T.MeshStandardMaterial({color: new T.Color(0.07,0.07,0.07)});
    let mainBodyGeom = new T.BoxGeometry(1.5,1.5,1.5);
    let mainBody = new T.Mesh(mainBodyGeom, bodyMat);
    mainBody.position.y = 0.75;
    frontloader.add(mainBody);

    let armsRot = new T.Group();
    armsRot.position.y = 1.;
    armsRot.position.z = 0.5;
    
    let armGeom = new T.BoxGeometry(0.2, 0.3, 1.2);
    let arm1 = new T.Mesh(armGeom, bodyMat);
    let arm2 = arm1.clone();
    arm1.position.x = 0.85;
    arm1.position.z = 0.6;
    arm2.position.x = -0.85;
    arm2.position.z = 0.6
    armsRot.add(arm1);
    armsRot.add(arm2);

    armsRot.rotation.x = Math.PI/4;

    frontloader.add(armsRot);

    let loadRot = new T.Group();
    loadRot.rotation.x = -Math.PI/4;
    loadRot.position.z = 1.2;
    loadRot.position.y = -0.1;

    let loadMat = new T.MeshStandardMaterial({color: "grey"});
    let loadBaseGeom = new T.BoxGeometry(1.5,0.2,0.7);
    let loadBase = new T.Mesh(loadBaseGeom, loadMat);
    loadBase.position.z = 0.35;
    loadRot.add(loadBase);
    
    let loadSideGeom = new T.BoxGeometry(1.5, 0.7, 0.2);
    let loadSide = new T.Mesh(loadSideGeom, loadMat);
    loadSide.position.y = 0.35;
    loadRot.add(loadSide);

    armsRot.add(loadRot);

    let wheelGeom = new T.CylinderGeometry(0.3,0.3,0.2);
    let wheelMat = new T.MeshStandardMaterial({color: "black"});
    let wheel1 = new T.Mesh(wheelGeom, wheelMat);
    let wheel2 = wheel1.clone();
    let wheel3 = wheel1.clone();
    let wheel4 = wheel1.clone();
    let wheel5 = wheel1.clone();
    let wheel6 = wheel1.clone();
    wheel1.rotation.z = Math.PI/2;
    wheel1.position.x = 0.85;
    wheel1.position.y = 0.3;
    wheel2.rotation.z = Math.PI/2;
    wheel2.position.x = -0.85;
    wheel2.position.y = 0.3;
    wheel3.rotation.z = Math.PI/2;
    wheel3.position.x = 0.85;
    wheel3.position.y = 0.3;
    wheel3.position.z = 0.5;
    wheel4.rotation.z = Math.PI/2;
    wheel4.position.x = -0.85;
    wheel4.position.y = 0.3;
    wheel4.position.z = 0.5;
    wheel5.rotation.z = Math.PI/2;
    wheel5.position.x = 0.85;
    wheel5.position.y = 0.3;
    wheel5.position.z = -0.5;
    wheel6.rotation.z = Math.PI/2;
    wheel6.position.x = -0.85;
    wheel6.position.y = 0.3;
    wheel6.position.z = -0.5;

    frontloader.add(wheel1);
    frontloader.add(wheel2);
    frontloader.add(wheel3);
    frontloader.add(wheel4);
    frontloader.add(wheel5);
    frontloader.add(wheel6);

    super(`Frontloader-${frontloaderObCtr++}`,frontloader, [
      ["x",-20,20,0],
      ["z",-20,20,0],
      ["theta",0,360,0],
      ["arm_rotate",0,70,0],
      ["load_rotate",-65,20,0]
    ]);
    frontloader.position.x = params.x ? Number(params.x) : 0;
    frontloader.position.y = params.y ? Number(params.y) : 0;
    frontloader.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    frontloader.scale.set(scale, scale, scale);
    this.frontloader = frontloader;
    this.armRot = armsRot;
    this.loadRot = loadRot;
    this.time = 0;
  }

  update(paramValues) {
    this.frontloader.position.x = paramValues[0];
    this.frontloader.position.z = paramValues[1];
    this.frontloader.rotation.y = degreesToRadians(paramValues[2]);
    this.armRot.rotation.x = Math.PI/4 - degreesToRadians(paramValues[3]);  
    this.loadRot.rotation.x = -Math.PI/4 - degreesToRadians(paramValues[4]);
  }

  stepWorld(delta,timeofday) {
    this.time += delta;
    let t = (this.time/1000) % 8;
    if(t >= 0 && t < 2) {
      t = t/2;
      this.frontloader.position.x = (1-t) * -7 + t * -10;
      this.frontloader.position.z = (1-t) * 14 + t * 11;
    }
    else if(t >= 2 && t < 3) {
      t = t-2;
      this.armRot.rotation.x = (1-t) * Math.PI/4 + t * Math.PI/3.7;
      this.loadRot.rotation.x = (1-t) * -Math.PI/4 + t * -Math.PI/6
    }
    else if(t >= 3 && t < 4) {
      t = t-3;
      this.armRot.rotation.x = (1-t) * Math.PI/3.7 + t * Math.PI/10;
      this.loadRot.rotation.x = (1-t) * -Math.PI/6 + t * -Math.PI/3;
    }
    else if(t >= 4 && t < 6) {
      t = (t-4)/2;
      this.frontloader.position.x = (1-t) * -10 + t * -7;
      this.frontloader.position.z = (1-t) * 11 + t * 14;
    }
    else if(t >= 6 && t < 7) {
      t = t-6;
      this.loadRot.rotation.x = (1-t) * -Math.PI/3 + t * Math.PI/14;
    }
    else if(t >= 7 && t < 8) {
      t = t-7;
      this.armRot.rotation.x = (1-t) * Math.PI/10 + t * Math.PI/4;
      this.loadRot.rotation.x = (1-t) * Math.PI/14 + t * -Math.PI/4;
    }
  }
}
