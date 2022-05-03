/*jshint esversion: 6 */
// @ts-check

/**
 * Graphics Town Framework - "Main" File
 *
 * This is the main file - it creates the world, populates it with
 * objects and behaviors, and starts things running
 *
 * The initial distributed version has a pretty empty world.
 * There are a few simple objects thrown in as examples.
 *
 * It is the students job to extend this by defining new object types
 * (in other files), then loading those files as modules, and using this
 * file to instantiate those objects in the world.
 */

import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js"
import { WorldUI } from "../libs/CS559-Framework/WorldUI.js";
import { GrCustomRect } from "../libs/GrCustomRect.js";
import * as T from "../libs/CS559-Three/build/three.module.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";
import { OBJLoader } from "../libs/CS559-Three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "../libs/CS559-Three/examples/jsm/loaders/MTLLoader.js";
import { GrStep } from "./GrStep.js";
import * as B from "./buildings.js";

import {main} from "../examples/main.js";
import { GrCar } from "./car.js";
import { GrCar_bw } from "./car.js";

/**m
 * The Graphics Town Main -
 * This builds up the world and makes it go...
 */

//#region Skyscraper textures
    let skyscraper_tex_bw = new T.TextureLoader().load("./images/SkyscraperBandW.png");
    let skyscraper_tex_cl = new T.TextureLoader().load("./images/SkyscraperColor.png");
    let skyscraper_bump = new T.TextureLoader().load("./images/SkyscraperBump.png");
    let skyscraper_mat_bw = new T.MeshStandardMaterial({map:skyscraper_tex_bw, bumpMap:skyscraper_bump});
    let skyscraper_mat_cl = new T.MeshStandardMaterial({map:skyscraper_tex_cl, bumpMap:skyscraper_bump});
//#endregion


//#region Bush textures
    let bush_tex = new T.TextureLoader().load("./images/Bush_Tex.jpg");
    let bush_bump = new T.TextureLoader().load("./images/Bush_Bump.jpg");
    let bush_mat_cl = new T.MeshStandardMaterial({map:bush_tex, bumpMap:bush_bump});
    let bush_mat_bw = new T.MeshStandardMaterial({map:bush_bump, bumpMap:bush_bump});

    let groundMat = shaderMaterial("./shaders/ground.vs","./shaders/ground.fs");
//#endregion

// make the world
let world = new GrWorld({
    width: 800,
    height: 600,
    groundplanesize: 20 // make the ground plane big enough for a world of stuff
});
world.objects[0].objects[0].material = groundMat;

//#region Car
    let carMat = shaderMaterial("./shaders/car.vs","./shaders/car.fs");
    let carLoader = new OBJLoader();
    /*new MTLLoader().load("./objects/Car.mtl",function(materials){
        carMat = materials;
        carLoader.setMaterials(materials);
    });*/
    carLoader.load("./objects/Car.obj",function(object) {
        object.scale.set(0.35,0.35,0.35);
        object.position.x = 2;
        object.rotateY((3*Math.PI)/2);
        object.traverse( function( child ) {
            if ( child instanceof T.Mesh ) {
                child.material = carMat;
            }
        }
        )
        let updateF = function(time, obj) {
            let theta = time/1000;
            obj.position.x = 2.5 * Math.cos(theta);
            obj.position.z = 2.5 * Math.sin(theta);
            obj.lookAt(2.5 * Math.cos(theta + 0.1), 0, 2.5 * Math.sin(theta + 0.1));
        }
        let carGr = new GrStep(object, updateF);
        world.add(carGr);
    });
//#endregion


// put stuff into the world
// this calls the example code (that puts a lot of objects into the world)
// you can look at it for reference, but do not use it in your assignment
//main(world);

//#region Add sunlight
    let sun = new T.DirectionalLight("white",1);
    sun.position.x = 20;
    sun.position.y = 20;
    sun.position.z = 20;
    sun.castShadow = true;
    world.add(new GrObject("Sun",sun));
//#endregion

//#region Skyscrapers
    let sky1_bw = new GrCustomRect({l:2,w:2,h:10,mat:skyscraper_mat_bw,x:-5,y:4,z:3});
    let sky_uvs = new Float32Array([
        0.5,0,0.5,1,0,0,0,1,0,0,0.5,1,
        0.5,0,0.5,1,0,0,0,1,0,0,0.5,1,
        0.5,0,0.5,1,0,0,0,1,0,0,0.5,1,
        0.5,0,0.5,1,0,0,0,1,0,0,0.5,1,
        0.5,0,0.5,1,1,0,0.5,0,0.5,1,1,0,
        0.5,0,0.5,1,0,0,0,1,0,0,0.5,1
    ])
    sky1_bw.rect.geometry.setAttribute("uv",new T.BufferAttribute(sky_uvs,2));
    world.add(sky1_bw);

    for(let i = 0; i < 5; i++) {
        let sky = sky1_bw.objects[0].clone();
        sky.translateX(-2.5*i - 2.5);
        world.add(new GrObject(`Sky_bw_${i+2}`,sky));
    }

    let sky1_cl = new GrObject("Sky_cl_1",sky1_bw.rect.clone());
    sky1_cl.objects[0].material = skyscraper_mat_cl;
    sky1_cl.objects[0].position.x = 5;
    sky1_cl.objects[0].position.z = -3;
    world.add(sky1_cl);

    for(let i = 0; i < 5; i++) {
        let sky = sky1_cl.objects[0].clone();
        sky.translateX(2.5*i + 2.5);
        world.add(new GrObject(`Sky_cl_${i+2}`,sky));
    }
//#endregion

//#region Road
    let roadCircleGeom = new T.RingBufferGeometry(2,3, 50);
    let roadCircleMat = new T.MeshStandardMaterial({color: "black"});
    let roadCircleObj = new T.Mesh(roadCircleGeom,roadCircleMat);
    roadCircleObj.rotateX(-Math.PI/2);
    roadCircleObj.position.y = 0.02;
    world.add(new GrObject("RoadCircle-1",roadCircleObj));

    let roadRGeom = new T.BoxBufferGeometry(17,0.01,1);
    let roadRMat = new T.MeshStandardMaterial({color:"#fc3d03"});
    let roadRObj = new T.Mesh(roadRGeom,roadRMat);
    roadRObj.position.x = 11;
    world.add(new GrObject("RoadR-1",roadRObj));

    let roadLGeom = new T.BoxBufferGeometry(17,0.01,1);
    let roadLMat = new T.MeshStandardMaterial({color:"grey"});
    let roadLObj = new T.Mesh(roadLGeom,roadLMat);
    roadLObj.position.x = -11;
    world.add(new GrObject("RoadL-1",roadLObj));
//#endregion

//#region Bushes
    let bush1_cl = new GrCustomRect({l:0.6,w:1,h:0.6,mat:bush_mat_cl,x:5,z:-1.6,y:-0.7});
    world.add(bush1_cl);

    for(let i = 0; i < 5; i++) {
        let bush = bush1_cl.rect.clone();
        bush.translateX(2.5 * i + 2.5);
        world.add(new GrObject(`Bush${i+2}_cl`,bush));
    }

    let bush1_bw = new GrCustomRect({l:0.6,w:1,h:0.6,mat:bush_mat_bw,x:-5,z:1.6,y:-0.7});
    world.add(bush1_bw);

    for(let i = 0; i < 5; i++) {
        let bush = bush1_bw.rect.clone();
        bush.translateX(-2.5 * i -2.5);
        world.add(new GrObject(`Bush${i+2}_bw`,bush));
    }
//#endregion

//#region Buildings from wkbk8
    let b1_1_cl = new B.GrBuilding1();
    b1_1_cl.objects[0].position.set(5,b1_1_cl.objects[0].position.y,-7);
    b1_1_cl.objects[0].rotateY(Math.PI);
    world.add(b1_1_cl);

    for(let i = 0; i < 5; i++) {
        let building = b1_1_cl.objects[0].clone();
        building.translateX(-2.5*i - 2.5);
        world.add(new GrObject(`b1_${i+2}_cl`,building));
    }

    let b1_1_bw = new B.GrBuilding1_bw();
    b1_1_bw.objects[0].position.set(-5,b1_1_bw.objects[0].position.y, 7);
    world.add(b1_1_bw);

    for(let i = 0; i <5; i++) {
        let building = b1_1_bw.objects[0].clone();
        building.translateX(-2.5*i - 2.5);
        world.add(new GrObject(`b1_${i+2}_bw`,building));
    }

    let b2_1_cl = new B.GrBuilding2({size:1.2,y:0.28});
    b2_1_cl.objects[0].position.set(5,b2_1_cl.objects[0].position.y, 3);
    world.add(b2_1_cl);

    for(let i = 0; i < 4; i++) {
        let building = b2_1_cl.objects[0].clone();
        building.translateX(3.125*i + 3.125);
        world.add(new GrObject(`b2_${i+2}_cl`,building));
    }

    let b2_7_cl = new B.GrBuilding2({size:1.2,y:0.28});
    b2_7_cl.objects[0].rotateY(Math.PI);
    b2_7_cl.objects[0].position.set(5,b2_7_cl.objects[0].position.y, 8);
    world.add(b2_7_cl);

    for(let i = 0; i < 4; i++) {
        let building = b2_7_cl.objects[0].clone();
        building.translateX(-3.125*i - 3.125);
        world.add(new GrObject(`b2_${i+8}_cl`,building));
    }

    let b2_13_cl = new B.GrBuilding2({size:1.2,y:0.28});
    b2_13_cl.objects[0].position.set(5,b2_13_cl.objects[0].position.y, 10);
    world.add(b2_13_cl);

    for(let i = 0; i < 4; i++) {
        let building = b2_13_cl.objects[0].clone();
        building.translateX(3.125*i + 3.125);
        world.add(new GrObject(`b2_${i+14}_cl`,building));
    }

    let b2_19_cl = new B.GrBuilding2({size:1.2,y:0.28});
    b2_19_cl.objects[0].rotateY(Math.PI);
    b2_19_cl.objects[0].position.set(5,b2_19_cl.objects[0].position.y, 15);
    world.add(b2_19_cl);

    for(let i = 0; i < 4; i++) {
        let building = b2_19_cl.objects[0].clone();
        building.translateX(-3.125*i - 3.125);
        world.add(new GrObject(`b2_${i+20}_cl`,building));
    }

    let b2_1_bw = new B.GrBuilding2_bw({size:1.2,y:0.28});
    b2_1_bw.objects[0].position.set(-5,b2_1_bw.objects[0].position.y, -3);
    b2_1_bw.objects[0].rotateY(Math.PI);
    world.add(b2_1_bw);

    for(let i = 0; i < 4; i++) {
        let building = b2_1_bw.objects[0].clone();
        building.translateX(3.125*i + 3.125);
        world.add(new GrObject(`b2_${i+2}_bw`,building));
    }

    let b2_7_bw = new B.GrBuilding2_bw({size:1.2,y:0.28});
    b2_7_bw.objects[0].position.set(-5,b2_7_bw.objects[0].position.y, -8);
    world.add(b2_7_bw);

    for(let i = 0; i < 4; i++) {
        let building = b2_7_bw.objects[0].clone();
        building.translateX(-3.125*i - 3.125);
        world.add(new GrObject(`b2_${i+8}_bw`,building));
    }

    let b2_13_bw = new B.GrBuilding2_bw({size:1.2,y:0.28});
    b2_13_bw.objects[0].position.set(-5,b2_13_bw.objects[0].position.y, -10);
    b2_13_bw.objects[0].rotateY(Math.PI);
    world.add(b2_13_bw);

    for(let i = 0; i < 4; i++) {
        let building = b2_13_bw.objects[0].clone();
        building.translateX(3.125*i + 3.125);
        world.add(new GrObject(`b2_${i+14}_bw`,building));
    }

    let b2_19_bw = new B.GrBuilding2_bw({size:1.2,y:0.28});
    b2_19_bw.objects[0].position.set(-5,b2_19_bw.objects[0].position.y, -15);
    world.add(b2_19_bw);

    for(let i = 0; i < 4; i++) {
        let building = b2_19_bw.objects[0].clone();
        building.translateX(-3.125*i - 3.125);
        world.add(new GrObject(`b2_${i+20}_bw`,building));
    }
//#endregion

//#region Some more roads
    let roadbw_mat = new T.MeshStandardMaterial({color:"white"});
    let road1_geom = new T.BoxBufferGeometry(18,0.01,1);
    let road2_geom = new T.BoxBufferGeometry(1,0.01,6);
    let roadbw1 = new T.Mesh(road1_geom,roadbw_mat);
    roadbw1.position.x = -9;
    roadbw1.position.z = -5.5;
    let roadbw2 = roadbw1.clone();
    roadbw2.position.z = -12.5;
    let roadbw3 = new T.Mesh(road2_geom,roadbw_mat);
    roadbw3.position.x = -0.5;
    roadbw3.position.z = -9;
    world.add(new GrObject("Roadbw1",roadbw1));
    world.add(new GrObject("Roadbw2",roadbw2));
    world.add(new GrObject("Roadbw3",roadbw3));

    let roadcl_mat = new T.MeshStandardMaterial({color:"#fc3d03"});
    let roadcl1 = new T.Mesh(road1_geom,roadcl_mat);
    roadcl1.position.x = 9;
    roadcl1.position.z = 5.5;
    let roadcl2 = roadcl1.clone();
    roadcl2.position.z = 12.5;
    let roadcl3 = new T.Mesh(road2_geom,roadcl_mat);
    roadcl3.position.x = 0.5;
    roadcl3.position.z = 9;
    world.add(new GrObject("Roadcl1",roadcl1));
    world.add(new GrObject("Roadcl2",roadcl2));
    world.add(new GrObject("Roadcl3",roadcl3));
//#endregion

//#region Trucks
    let truck1 = new GrCar({size:1.4, y:0.07});
    let truck_cl_update = function(time,obj) {
        let t = (time/1000) % 10;
        if(t >= 0 && t < 2) {
            t = t/2;
            obj.position.x = 17.5 * (1-t) + 0.5 * t;
            obj.position.z = 5.5;
            obj.lookAt(obj.position.x-1,obj.position.y,obj.position.z); 
        }
        else if(t >= 2 && t < 3) {
            t = t - 2;
            obj.position.x = 0.5;
            obj.position.z = 6 * (1-t) + 12 * t;
            obj.lookAt(obj.position.x,obj.position.y,obj.position.z+1);
        }
        else if(t >= 3 && t < 5) {
            t = (t - 3)/2;
            obj.position.x = 0.5 * (1-t) + 17.5 * t;
            obj.position.z = 12.5;
            obj.lookAt(obj.position.x+1,obj.position.y,obj.position.z);
        }
        else if(t >= 5 && t < 7) {
            t = (t-5)/2;
            obj.position.x = 17.5 * (1-t) + 0.5 * t;
            obj.position.z = 12.5;
            obj.lookAt(obj.position.x-1,obj.position.y,obj.position.z);
        }
        else if(t >= 7 && t < 8) {
            t = t-7;
            obj.position.x = 0.5;
            obj.position.z = 12 * (1-t) + 6 * t;
            obj.lookAt(obj.position.x,obj.position.y,obj.position.z-1);
        }
        else {
            t = (t-8)/2;
            obj.position.x = 0.5 * (1-t) + 17.5 * t;
            obj.position.z = 5.5;
            obj.lookAt(obj.position.x+1,obj.position.y,obj.position.z);
        }
    }
    let truck_cl = new GrStep(truck1.objects[0],truck_cl_update);
    let truck2 = new GrCar_bw({size:1.4, y:0.07});
    let truck_bw_update = function(time,obj) {
        let t = (time/1000) % 10;
        if(t >= 0 && t < 2) {
            t = t/2;
            obj.position.x = -17.5 * (1-t) - 0.5 * t;
            obj.position.z = -5.5;
            obj.lookAt(obj.position.x+1,obj.position.y,obj.position.z); 
        }
        else if(t >= 2 && t < 3) {
            t = t - 2;
            obj.position.x = -0.5;
            obj.position.z = -6 * (1-t) + -12 * t;
            obj.lookAt(obj.position.x,obj.position.y,obj.position.z-1);
        }
        else if(t >= 3 && t < 5) {
            t = (t - 3)/2;
            obj.position.x = -0.5 * (1-t) - 17.5 * t;
            obj.position.z = -12.5;
            obj.lookAt(obj.position.x-1,obj.position.y,obj.position.z);
        }
        else if(t >= 5 && t < 7) {
            t = (t-5)/2;
            obj.position.x = -17.5 * (1-t) + -0.5 * t;
            obj.position.z = -12.5;
            obj.lookAt(obj.position.x+1,obj.position.y,obj.position.z);
        }
        else if(t >= 7 && t < 8) {
            t = t-7;
            obj.position.x = -0.5;
            obj.position.z = -12 * (1-t) + -6 * t;
            obj.lookAt(obj.position.x,obj.position.y,obj.position.z+1);
        }
        else {
            t = (t-8)/2;
            obj.position.x = -0.5 * (1-t) - 17.5 * t;
            obj.position.z = -5.5;
            obj.lookAt(obj.position.x-1,obj.position.y,obj.position.z);
        }
    }
    let truck_bw = new GrStep(truck2.objects[0],truck_bw_update);
    world.add(truck_cl);
    world.add(truck_bw);
    //#endregion

// while making your objects, be sure to identify some of them as "highlighted"

///////////////////////////////////////////////////////////////
// because I did not store the objects I want to highlight in variables, I need to look them up by name
// This code is included since it might be useful if you want to highlight your objects here
function highlight(obName) {
    const toHighlight = world.objects.find(ob => ob.name === obName);
    if (toHighlight) {
        toHighlight.highlighted = true;
    } else {
        throw `no object named ${obName} for highlighting!`;
    }
}
// of course, the student should highlight their own objects, not these
//highlight("SimpleHouse-5");
//highlight("Helicopter-0");
//highlight("Track Car");
//highlight("MorphTest");

///////////////////////////////////////////////////////////////
// build and run the UI
// only after all the objects exist can we build the UI
// @ts-ignore       // we're sticking a new thing into the world
world.ui = new WorldUI(world);
// now make it go!
world.go();
