import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js"

let GrStepCtr = 0;
export class GrStep extends GrObject {
    constructor(obj, updateF) {
        super(`GrStep-${GrStepCtr++}`,obj);
        this.updateF = updateF;
        this.time = 0;
        this.obj = obj;
    }

    stepWorld(delta, timeOfDay){
        this.time += delta;
        this.updateF(this.time, this.obj);
    }
}