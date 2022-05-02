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

import {main} from "../examples/main.js";
import { ObjectSpaceNormalMap, Vector3 } from "../libs/CS559-Three/build/three.module.js";

/**m
 * The Graphics Town Main -
 * This builds up the world and makes it go...
 */
let skyscraper_tex_bw = new T.TextureLoader().load("./images/SkyscraperBandW.png");
let skyscraper_tex_cl = new T.TextureLoader().load("./images/SkyscraperColor.png");
let skyscraper_bump = new T.TextureLoader().load("./images/SkyscraperBump.png");
let skyscraper_mat_bw = new T.MeshStandardMaterial({map:skyscraper_tex_bw, bumpMap:skyscraper_bump});
let skyscraper_mat_cl = new T.MeshStandardMaterial({map:skyscraper_tex_cl, bumpMap:skyscraper_bump});


let carMat = new T.MeshStandardMaterial({color:"blue"});

let groundMat = shaderMaterial("./shaders/ground.vs","./shaders/ground.fs");

// make the world
let world = new GrWorld({
    width: 800,
    height: 600,
    groundplanesize: 20 // make the ground plane big enough for a world of stuff
});
world.objects[0].objects[0].material = groundMat;

let carLoader = new OBJLoader();
new MTLLoader().load("./objects/Car.mtl",function(materials){
    carLoader.setMaterials(materials);
});
carLoader.load("./objects/Car.obj",function(object) {
    object.scale.set(0.35,0.35,0.35);
    object.position.x = 2;
    object.rotateY((3*Math.PI)/2);
    world.add(new GrObject("Car1", object));
});


// put stuff into the world
// this calls the example code (that puts a lot of objects into the world)
// you can look at it for reference, but do not use it in your assignment
//main(world);
let sky1_bw = new GrCustomRect({l:2,w:2,h:10,mat:skyscraper_mat_bw,x:-5,y:4,z:2});
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
sky1_cl.objects[0].position.z = -2;
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
console.log(world.objCount);
world.go();
