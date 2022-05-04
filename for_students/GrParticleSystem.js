import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js"

let GrParticleCtr = 0;
export class GrParticleSystem extends GrObject {
    constructor(obj, updateF) {
        super(`Particle_system_${GrParticleCtr++}`,obj);
        this.updateF = updateF;
        this.obj = obj;
    }

    stepWorld(delta, timeOfDay){
        this.updateF(delta, this.obj);
    }
}