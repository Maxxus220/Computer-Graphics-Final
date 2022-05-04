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
import { AutoUI } from "../libs/CS559-Framework/AutoUI.js";

import {main} from "../examples/main.js";
import { GrCar } from "./car.js";
import { GrCar_bw } from "./car.js";
import { GrFrontLoader, GrFrontLoader_bw } from "./front_loader.js";
import { GrParticleSystem } from "./GrParticleSystem.js";

/**m
 * The Graphics Town Main -
 * This builds up the world and makes it go...
 */
let div = document.getElementById("div1");

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

let rain_tex = new T.TextureLoader().load("./images/raindrop.png");

// make the world
let world = new GrWorld({
    width: 800,
    height: 600,
    groundplanesize: 20, // make the ground plane big enough for a world of stuff
    where:div
});
world.objects[0].objects[0].material = groundMat;

//#region Car
    let carMat = shaderMaterial("./shaders/car.vs","./shaders/car.fs");
    let carLoader = new OBJLoader();
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
        carGr.rideable = carGr.objects[0];
        carGr.name = "Car_0";
        world.add(carGr);
        world.ui = new WorldUI(world);
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
    world.add(new GrObject("Sun_0",sun));
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
    sky1_bw.name = "Skyscraper_0_bw";
    world.add(sky1_bw);

    for(let i = 0; i < 5; i++) {
        let sky = sky1_bw.objects[0].clone();
        sky.translateX(-2.5*i - 2.5);
        world.add(new GrObject(`Skyscraper_${i+1}_bw`,sky));
    }

    let sky1_cl = new GrObject("Skyscraper_0_cl",sky1_bw.rect.clone());
    sky1_cl.objects[0].material = skyscraper_mat_cl;
    sky1_cl.objects[0].position.x = 5;
    sky1_cl.objects[0].position.z = -3;
    world.add(sky1_cl);

    for(let i = 0; i < 5; i++) {
        let sky = sky1_cl.objects[0].clone();
        sky.translateX(2.5*i + 2.5);
        world.add(new GrObject(`Skyscraper_${i+1}_cl`,sky));
    }
//#endregion

//#region Road
    let roadCircleGeom = new T.RingBufferGeometry(2,3, 50);
    let roadCircleMat = new T.MeshStandardMaterial({color: "black"});
    let roadCircleObj = new T.Mesh(roadCircleGeom,roadCircleMat);
    roadCircleObj.rotateX(-Math.PI/2);
    roadCircleObj.position.y = 0.03;
    world.add(new GrObject("RoadCircle_0",roadCircleObj));

    let roadRGeom = new T.BoxBufferGeometry(17,0.01,1);
    let roadRMat = new T.MeshStandardMaterial({color:"#fc3d03"});
    let roadRObj = new T.Mesh(roadRGeom,roadRMat);
    roadRObj.position.x = 11;
    roadRObj.position.y = 0.005;
    world.add(new GrObject("RoadR_0",roadRObj));

    let roadLGeom = new T.BoxBufferGeometry(17,0.01,1);
    let roadLMat = new T.MeshStandardMaterial({color:"grey"});
    let roadLObj = new T.Mesh(roadLGeom,roadLMat);
    roadLObj.position.x = -11;
    roadLObj.position.y = 0.005;
    world.add(new GrObject("RoadL_0",roadLObj));
//#endregion

//#region Bushes
    let bush1_cl = new GrCustomRect({l:0.6,w:1,h:0.6,mat:bush_mat_cl,x:5,z:-1.6,y:-0.7});
    bush1_cl.name = "Bush_0_cl";
    world.add(bush1_cl);

    for(let i = 0; i < 5; i++) {
        let bush = bush1_cl.rect.clone();
        bush.translateX(2.5 * i + 2.5);
        world.add(new GrObject(`Bush_${i+1}_cl`,bush));
    }

    let bush1_bw = new GrCustomRect({l:0.6,w:1,h:0.6,mat:bush_mat_bw,x:-5,z:1.6,y:-0.7});
    bush1_bw.name = "Bush_0_bw"
    world.add(bush1_bw);

    for(let i = 0; i < 5; i++) {
        let bush = bush1_bw.rect.clone();
        bush.translateX(-2.5 * i -2.5);
        world.add(new GrObject(`Bush_${i+1}_bw`,bush));
    }
//#endregion

//#region Buildings from wkbk8
    let b1_1_cl = new B.GrBuilding1();
    b1_1_cl.name = "Shed_0_cl";
    b1_1_cl.objects[0].position.set(5,b1_1_cl.objects[0].position.y,-7);
    b1_1_cl.objects[0].rotateY(Math.PI);
    world.add(b1_1_cl);

    for(let i = 0; i < 5; i++) {
        let building = b1_1_cl.objects[0].clone();
        building.translateX(-2.5*i - 2.5);
        world.add(new GrObject(`Shed_${i+1}_cl`,building));
    }

    let b1_1_bw = new B.GrBuilding1_bw();
    b1_1_bw.name = "Shed_0_bw";
    b1_1_bw.objects[0].position.set(-5,b1_1_bw.objects[0].position.y, 7);
    world.add(b1_1_bw);

    for(let i = 0; i <5; i++) {
        let building = b1_1_bw.objects[0].clone();
        building.translateX(-2.5*i - 2.5);
        world.add(new GrObject(`Shed_${i+1}_bw`,building));
    }

    let b2_1_cl = new B.GrBuilding2({size:1.2,y:0.28});
    b2_1_cl.name = "GravelRoof_0_cl"
    b2_1_cl.objects[0].position.set(5,b2_1_cl.objects[0].position.y, 3);
    world.add(b2_1_cl);

    for(let i = 0; i < 4; i++) {
        let building = b2_1_cl.objects[0].clone();
        building.translateX(3.125*i + 3.125);
        world.add(new GrObject(`GravelRoof_${i+1}_cl`,building));
    }

    let b2_7_cl = new B.GrBuilding2({size:1.2,y:0.28});
    b2_7_cl.name = "GravelRoof_6_cl";
    b2_7_cl.objects[0].rotateY(Math.PI);
    b2_7_cl.objects[0].position.set(5,b2_7_cl.objects[0].position.y, 8);
    world.add(b2_7_cl);

    for(let i = 0; i < 4; i++) {
        let building = b2_7_cl.objects[0].clone();
        building.translateX(-3.125*i - 3.125);
        world.add(new GrObject(`GravelRoof_${i+7}_cl`,building));
    }

    let b2_13_cl = new B.GrBuilding2({size:1.2,y:0.28});
    b2_13_cl.name = "GravelRoof_12_cl";
    b2_13_cl.objects[0].position.set(5,b2_13_cl.objects[0].position.y, 10);
    world.add(b2_13_cl);

    for(let i = 0; i < 4; i++) {
        let building = b2_13_cl.objects[0].clone();
        building.translateX(3.125*i + 3.125);
        world.add(new GrObject(`GravelRoof_${i+13}_cl`,building));
    }

    let b2_19_cl = new B.GrBuilding2({size:1.2,y:0.28});
    b2_19_cl.name = "GravelRoof_18_cl";
    b2_19_cl.objects[0].rotateY(Math.PI);
    b2_19_cl.objects[0].position.set(5,b2_19_cl.objects[0].position.y, 15);
    world.add(b2_19_cl);

    for(let i = 0; i < 4; i++) {
        let building = b2_19_cl.objects[0].clone();
        building.translateX(-3.125*i - 3.125);
        world.add(new GrObject(`GravelRoof_${i+19}_cl`,building));
    }

    let b2_1_bw = new B.GrBuilding2_bw({size:1.2,y:0.28});
    b2_1_bw.name = "GravelRoof_0_bw";
    b2_1_bw.objects[0].position.set(-5,b2_1_bw.objects[0].position.y, -3);
    b2_1_bw.objects[0].rotateY(Math.PI);
    world.add(b2_1_bw);

    for(let i = 0; i < 4; i++) {
        let building = b2_1_bw.objects[0].clone();
        building.translateX(3.125*i + 3.125);
        world.add(new GrObject(`GravelRoof_${i+1}_bw`,building));
    }

    let b2_7_bw = new B.GrBuilding2_bw({size:1.2,y:0.28});
    b2_7_bw.name = "GravelRoof_6_bw";
    b2_7_bw.objects[0].position.set(-5,b2_7_bw.objects[0].position.y, -8);
    world.add(b2_7_bw);

    for(let i = 0; i < 4; i++) {
        let building = b2_7_bw.objects[0].clone();
        building.translateX(-3.125*i - 3.125);
        world.add(new GrObject(`GravelRoof_${i+7}_bw`,building));
    }

    let b2_13_bw = new B.GrBuilding2_bw({size:1.2,y:0.28});
    b2_13_bw.name = "GravelRoof_12_bw";
    b2_13_bw.objects[0].position.set(-5,b2_13_bw.objects[0].position.y, -10);
    b2_13_bw.objects[0].rotateY(Math.PI);
    world.add(b2_13_bw);

    for(let i = 0; i < 4; i++) {
        let building = b2_13_bw.objects[0].clone();
        building.translateX(3.125*i + 3.125);
        world.add(new GrObject(`GravelRoof_${i+13}_bw`,building));
    }

    let b2_19_bw = new B.GrBuilding2_bw({size:1.2,y:0.28});
    b2_19_bw.name = "GravelRoof_18_bw";
    b2_19_bw.objects[0].position.set(-5,b2_19_bw.objects[0].position.y, -15);
    world.add(b2_19_bw);

    for(let i = 0; i < 4; i++) {
        let building = b2_19_bw.objects[0].clone();
        building.translateX(-3.125*i - 3.125);
        world.add(new GrObject(`GravelRoof_${i+19}_bw`,building));
    }
//#endregion

//#region Some more roads
    let roadbw_mat = new T.MeshStandardMaterial({color:"white"});
    let road1_geom = new T.BoxBufferGeometry(18,0.01,1);
    let road2_geom = new T.BoxBufferGeometry(1,0.01,6);
    let roadbw1 = new T.Mesh(road1_geom,roadbw_mat);
    roadbw1.position.x = -9;
    roadbw1.position.z = -5.5;
    roadbw1.position.y = 0.005;
    let roadbw2 = roadbw1.clone();
    roadbw2.position.z = -12.5;
    let roadbw3 = new T.Mesh(road2_geom,roadbw_mat);
    roadbw3.position.x = -0.5;
    roadbw3.position.z = -9;
    roadbw3.position.y = 0.005;
    world.add(new GrObject("Road_0_bw",roadbw1));
    world.add(new GrObject("Road_1_bw",roadbw2));
    world.add(new GrObject("Road_2_bw",roadbw3));

    let roadcl_mat = new T.MeshStandardMaterial({color:"#fc3d03"});
    let roadcl1 = new T.Mesh(road1_geom,roadcl_mat);
    roadcl1.position.x = 9;
    roadcl1.position.z = 5.5;
    roadcl1.position.y = 0.005;
    let roadcl2 = roadcl1.clone();
    roadcl2.position.z = 12.5;
    let roadcl3 = new T.Mesh(road2_geom,roadcl_mat);
    roadcl3.position.x = 0.5;
    roadcl3.position.z = 9;
    roadcl3.position.y = 0.005;
    world.add(new GrObject("Road_0_cl",roadcl1));
    world.add(new GrObject("Road_1_cl",roadcl2));
    world.add(new GrObject("Road_2_cl",roadcl3));
//#endregion

//#region Trucks
    let truck1 = new GrCar({size:1.4, y:0.07});
    let truck_cl_update = function(time,obj) {
        let t = (time/1000) % 12;
        if(t >= 0 && t < 1) {
            obj.position.x = 17.5;
            obj.position.z = 5.5;
            obj.lookAt(obj.position.x+1,obj.position.y,obj.position.z); 
        }
        else if(t >= 1 && t < 3) {
            t = (t-1)/2;
            obj.position.x = 17.5 * (1-t) + 0.5 * t;
            obj.position.z = 5.5;
            obj.lookAt(obj.position.x-1,obj.position.y,obj.position.z); 
        }
        else if(t >= 3 && t < 4) {
            t = t - 3;
            obj.position.x = 0.5;
            obj.position.z = 6 * (1-t) + 12 * t;
            obj.lookAt(obj.position.x,obj.position.y,obj.position.z+1);
        }
        else if(t >= 4 && t < 6) {
            t = (t - 4)/2;
            obj.position.x = 0.5 * (1-t) + 17.5 * t;
            obj.position.z = 12.5;
            obj.lookAt(obj.position.x+1,obj.position.y,obj.position.z);
        }
        else if(t >= 6 && t < 7) {
            obj.position.x = 17.5;
            obj.position.z = 12.5;
            obj.lookAt(obj.position.x+1,obj.position.y,obj.position.z);
        }
        else if(t >= 7 && t < 9) {
            t = (t-7)/2;
            obj.position.x = 17.5 * (1-t) + 0.5 * t;
            obj.position.z = 12.5;
            obj.lookAt(obj.position.x-1,obj.position.y,obj.position.z);
        }
        else if(t >= 9 && t < 10) {
            t = t-9;
            obj.position.x = 0.5;
            obj.position.z = 12 * (1-t) + 6 * t;
            obj.lookAt(obj.position.x,obj.position.y,obj.position.z-1);
        }
        else {
            t = (t-10)/2;
            obj.position.x = 0.5 * (1-t) + 17.5 * t;
            obj.position.z = 5.5;
            obj.lookAt(obj.position.x+1,obj.position.y,obj.position.z);
        }
    }
    let truck_cl = new GrStep(truck1.objects[0],truck_cl_update);
    truck_cl.rideable = truck_cl.objects[0];
    truck_cl.name = "Truck_0_cl";
    let truck2 = new GrCar_bw({size:1.4, y:0.07});
    let truck_bw_update = function(time,obj) {
        let t = (time/1000) % 12;
        if(t >= 0 && t < 1) {
            obj.position.x = -17.5;
            obj.position.z = -5.5;
            obj.lookAt(obj.position.x-1,obj.position.y,obj.position.z);
        }
        else if(t >= 1 && t < 3) {
            t = (t-1)/2;
            obj.position.x = -17.5 * (1-t) - 0.5 * t;
            obj.position.z = -5.5;
            obj.lookAt(obj.position.x+1,obj.position.y,obj.position.z); 
        }
        else if(t >= 3 && t < 4) {
            t = t - 3;
            obj.position.x = -0.5;
            obj.position.z = -6 * (1-t) + -12 * t;
            obj.lookAt(obj.position.x,obj.position.y,obj.position.z-1);
        }
        else if(t >= 4 && t < 6) {
            t = (t - 4)/2;
            obj.position.x = -0.5 * (1-t) - 17.5 * t;
            obj.position.z = -12.5;
            obj.lookAt(obj.position.x-1,obj.position.y,obj.position.z);
        }
        else if(t >= 6 && t < 7) {
            obj.position.x = -17.5;
            obj.position.z = -12.5;
            obj.lookAt(obj.position.x-1,obj.position.y,obj.position.z);
        }
        else if(t >= 7 && t < 9) {
            t = (t-7)/2;
            obj.position.x = -17.5 * (1-t) + -0.5 * t;
            obj.position.z = -12.5;
            obj.lookAt(obj.position.x+1,obj.position.y,obj.position.z);
        }
        else if(t >= 9 && t < 10) {
            t = t-9;
            obj.position.x = -0.5;
            obj.position.z = -12 * (1-t) + -6 * t;
            obj.lookAt(obj.position.x,obj.position.y,obj.position.z+1);
        }
        else {
            t = (t-10)/2;
            obj.position.x = -0.5 * (1-t) - 17.5 * t;
            obj.position.z = -5.5;
            obj.lookAt(obj.position.x-1,obj.position.y,obj.position.z);
        }
    }
    let truck_bw = new GrStep(truck2.objects[0],truck_bw_update);
    truck_bw.rideable = truck_bw.objects[0];
    truck_bw.name = "Truck_0_bw";
    world.add(truck_cl);
    world.add(truck_bw);
    //#endregion

//#region Passengers
    let passengerGeom = new T.BoxBufferGeometry(0.2,0.6,0.2);
    let passenger_bw_mat = new T.MeshStandardMaterial({color:new T.Color(0.07,0.07,0.07)});
    let passenger_cl_mat = new T.MeshStandardMaterial({color:"red"});

    let passenger_bw_obj = new T.Mesh(passengerGeom,passenger_bw_mat);
    let passenger_cl_obj = new T.Mesh(passengerGeom,passenger_cl_mat);
    passenger_bw_obj.position.y = 0.3;
    passenger_cl_obj.position.y = 0.3;

    let passenger_bw_update = function(time,obj) {
        let t = (time/1000) % 12;
        if(t >= 0 && t < 1) {
            obj.visible = true;
            obj.position.x = -17.5;
            obj.position.z = -3.5 * (1-t) + -5 * t; 
        }
        else if(t >= 6 && t < 7) {
            obj.visible = true;
            t = t-6;
            obj.position.x = -17.5;
            obj.position.z = -12.25 * (1-t) + -10.5 * t; 
        }
        else {
            obj.visible = false;
        }
    }
    let passenger_cl_update = function(time,obj) {
        let t = (time/1000) % 12;
        if(t >= 0 && t < 1) {
            obj.visible = true;
            obj.position.x = 17.5;
            obj.position.z = 3.5 * (1-t) + 5 * t; 
        }
        else if(t >= 6 && t < 7) {
            obj.visible = true;
            t = t-6;
            obj.position.x = 17.5;
            obj.position.z = 12.25 * (1-t) + 10.5 * t; 
        }
        else {
            obj.visible = false;
        }
    }

    let passenger_bw = new GrStep(passenger_bw_obj,passenger_bw_update);
    let passenger_cl = new GrStep(passenger_cl_obj,passenger_cl_update);
    passenger_bw.name = "Passenger_0_bw";
    passenger_cl.name = "Passenger_0_cl";
    world.add(passenger_bw);
    world.add(passenger_cl);
//#endregion

//#region FrontLoaders
    let front_loader_cl = new GrFrontLoader({size:0.5,x:7,z:-14});
    front_loader_cl.objects[0].rotateY(Math.PI/4);
    front_loader_cl.rideable = front_loader_cl.objects[0];
    front_loader_cl.name = "Frontloader_0_cl";
    world.add(front_loader_cl);

    let front_loader_bw = new GrFrontLoader_bw({size:0.5,x:-7,z:14});
    front_loader_bw.objects[0].rotateY(Math.PI + Math.PI/4);
    front_loader_bw.rideable = front_loader_bw.objects[0];
    front_loader_bw.name = "Frontloader_0_bw";
    world.add(front_loader_bw);
//#endregion

//#region Rain particle system
    let particleCount = 9000;
    let particles = new T.BufferGeometry();
    let particle_pos = new Float32Array(particleCount * 3);
    for(let i = 0; i < particleCount * 3; i++) {
        switch(i % 3){
            case 0:
            case 2:
                particle_pos[i] = Math.random() * 40 - 20;
                break;
            case 1:
                particle_pos[i] = 17;
                break;
        }
    }
    let particle_vy = new Float32Array(particleCount)
    for(let i = 0; i < particleCount; i++) {
        particle_vy[i] = -(Math.random() * 0.5 + 0.25);
    }
    particles.setAttribute("position",new T.BufferAttribute(particle_pos,3));
    particles.setAttribute("velocity", new T.BufferAttribute(particle_vy,1));
    let particle_mat = new T.PointsMaterial({
        size:0.7,
        color:"#C4D3DF",
        map:rain_tex,
        transparent:true
    })
    let particle_system = new T.Points(particles,particle_mat);
    let particle_update = function(delta, obj) {
        let position = obj.geometry.attributes.position.array;
        let velocity = obj.geometry.attributes.velocity.array;
        for(let i = 0; i < particleCount; i++) {
            if(position[i*3 + 1] <= 0) {
                position[i*3] = Math.random()*40 - 20;
                position[i*3 + 1] = 17;
                position[i*3 + 2] = Math.random()*40 - 20;
                velocity[i] = -(Math.random() * 0.5 + 0.25);
            }
            else {
                position[i*3 + 1] = position[i*3 + 1] + velocity[i]*delta/15;
            }
        }
        obj.geometry.attributes.position.needsUpdate = true;
        obj.geometry.attributes.velocity.needsUpdate = true;
    }
    let gr_particle_system = new GrParticleSystem(particle_system, particle_update)
    gr_particle_system.name = "ParticleSystem_0"
    world.add(gr_particle_system);
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
highlight("Skyscraper_0_bw");
highlight("Skyscraper_0_cl");
highlight("Bush_0_cl");
highlight("Bush_0_bw");


///////////////////////////////////////////////////////////////
// build and run the UI
// only after all the objects exist can we build the UI
// @ts-ignore       // we're sticking a new thing into the world
// now make it go!
world.go();
