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

/**m
 * The Graphics Town Main -
 * This builds up the world and makes it go...
 */

// Skyscraper textures
let skyscraper_tex_bw = new T.TextureLoader().load("./images/SkyscraperBandW.png");
let skyscraper_tex_cl = new T.TextureLoader().load("./images/SkyscraperColor.png");
let skyscraper_bump = new T.TextureLoader().load("./images/SkyscraperBump.png");
let skyscraper_mat_bw = new T.MeshStandardMaterial({map:skyscraper_tex_bw, bumpMap:skyscraper_bump});
let skyscraper_mat_cl = new T.MeshStandardMaterial({map:skyscraper_tex_cl, bumpMap:skyscraper_bump});


// Bush textures
let bush_tex = new T.TextureLoader().load("./images/Bush_Tex.jpg");
let bush_bump = new T.TextureLoader().load("./images/Bush_Bump.jpg");
let bush_mat_cl = new T.MeshStandardMaterial({map:bush_tex, bumpMap:bush_bump});
let bush_mat_bw = new T.MeshStandardMaterial({map:bush_bump, bumpMap:bush_bump});

let groundMat = shaderMaterial("./shaders/ground.vs","./shaders/ground.fs");

// make the world
let world = new GrWorld({
    width: 800,
    height: 600,
    groundplanesize: 20 // make the ground plane big enough for a world of stuff
});
world.objects[0].objects[0].material = groundMat;

// Car
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
    carGr.highlighted = true;
    world.add(carGr);
});


// put stuff into the world
// this calls the example code (that puts a lot of objects into the world)
// you can look at it for reference, but do not use it in your assignment
//main(world);

let sun = new T.DirectionalLight("white",1);
sun.position.x = 20;
sun.position.y = 20;
sun.position.z = 20;
sun.castShadow = true;
world.add(new GrObject("Sun",sun));

// Skyscrapers
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

let sky2_bw = new GrObject("Sky_bw_2",sky1_bw.rect.clone());
sky2_bw.objects[0].translateX(-2.5);
world.add(sky2_bw);
let sky3_bw = new GrObject("Sky_bw_3",sky2_bw.objects[0].clone());
sky3_bw.objects[0].translateX(-2.5);
world.add(sky3_bw);
let sky4_bw = new GrObject("Sky_bw_4",sky3_bw.objects[0].clone());
sky4_bw.objects[0].translateX(-2.5);
world.add(sky4_bw);
let sky5_bw = new GrObject("Sky_bw_5",sky4_bw.objects[0].clone());
sky5_bw.objects[0].translateX(-2.5);
world.add(sky5_bw);
let sky6_bw = new GrObject("Sky_bw_6",sky5_bw.objects[0].clone());
sky6_bw.objects[0].translateX(-2.5);
world.add(sky6_bw);

let sky1_cl = new GrObject("Sky_cl_1",sky1_bw.rect.clone());
sky1_cl.objects[0].material = skyscraper_mat_cl;
sky1_cl.objects[0].position.x = 5;
sky1_cl.objects[0].position.z = -3;
world.add(sky1_cl);

let sky2_cl = new GrObject("Sky_cl_2",sky1_cl.objects[0].clone());
sky2_cl.objects[0].translateX(2.5);
world.add(sky2_cl);
let sky3_cl = new GrObject("Sky_cl_3",sky2_cl.objects[0].clone());
sky3_cl.objects[0].translateX(2.5);
world.add(sky3_cl);
let sky4_cl = new GrObject("Sky_cl_4",sky3_cl.objects[0].clone());
sky4_cl.objects[0].translateX(2.5);
world.add(sky4_cl);
let sky5_cl = new GrObject("Sky_cl_5",sky4_cl.objects[0].clone());
sky5_cl.objects[0].translateX(2.5);
world.add(sky5_cl);
let sky6_cl = new GrObject("Sky_cl_6",sky5_cl.objects[0].clone());
sky6_cl.objects[0].translateX(2.5);
world.add(sky6_cl);

// Road
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

// Bushes
let bush1_cl = new GrCustomRect({l:0.6,w:1,h:0.6,mat:bush_mat_cl,x:5,z:-1.6,y:-0.7});
world.add(bush1_cl);

let bush2_cl = new GrObject("Bush2_cl", bush1_cl.rect.clone());
bush2_cl.objects[0].translateX(2.5);
world.add(bush2_cl);

let bush3_cl = new GrObject("Bush3_cl", bush2_cl.objects[0].clone());
bush3_cl.objects[0].translateX(2.5);
world.add(bush3_cl);

let bush4_cl = new GrObject("Bush4_cl", bush3_cl.objects[0].clone());
bush4_cl.objects[0].translateX(2.5);
world.add(bush4_cl);

let bush5_cl = new GrObject("Bush5_cl", bush4_cl.objects[0].clone());
bush5_cl.objects[0].translateX(2.5);
world.add(bush5_cl);

let bush6_cl = new GrObject("Bush6_cl", bush5_cl.objects[0].clone());
bush6_cl.objects[0].translateX(2.5);
world.add(bush6_cl);

let bush1_bw = new GrCustomRect({l:0.6,w:1,h:0.6,mat:bush_mat_bw,x:-5,z:1.6,y:-0.7});
world.add(bush1_bw);

let bush2_bw = new GrObject("Bush2_bw", bush1_bw.rect.clone());
bush2_bw.objects[0].translateX(-2.5);
world.add(bush2_bw);

let bush3_bw = new GrObject("Bush3_bw", bush2_bw.objects[0].clone());
bush3_bw.objects[0].translateX(-2.5);
world.add(bush3_bw);

let bush4_bw = new GrObject("Bush4_bw", bush3_bw.objects[0].clone());
bush4_bw.objects[0].translateX(-2.5);
world.add(bush4_bw);

let bush5_bw = new GrObject("Bush5_bw", bush4_bw.objects[0].clone());
bush5_bw.objects[0].translateX(-2.5);
world.add(bush5_bw);

let bush6_bw = new GrObject("Bush6_bw", bush5_bw.objects[0].clone());
bush6_bw.objects[0].translateX(-2.5);
world.add(bush6_bw);

// Buildings from wkbk8
let b1_1_cl = new B.GrBuilding1();
b1_1_cl.objects[0].position.set(5,b1_1_cl.objects[0].position.y,-7);
b1_1_cl.objects[0].rotateY(Math.PI);
world.add(b1_1_cl);

for(let i = 0; i < 5; i++) {
    let building = b1_1_cl.objects[0].clone();
    building.translateX(-2.5*i - 2.5);
    world.add(new GrObject(`b1_${i+2}_cl`,building));
}

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
