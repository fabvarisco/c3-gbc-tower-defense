// entityController.ts

import {IEntityStats} from "./globals.js";

enum States {
    default = "default",
    click = "walk",
    hover = "attack",
    active = "hit",
    disabled = "disabled"
}

class CustomButtonController {
    private inst: InstanceType.CustomButtonEntity;
    private state: States;
    private activeTimer = 0;
    private activeInterval = 3;

    private eventList: any = {
        "spawnHero": this.spawnHero.bind(this),
    }

   get instance(): InstanceType.CustomButtonEntity  {
        return this.inst;
    }

    private hashState = {
        // walk: this.stateWalk.bind(this),
        // attack: this.stateAttack.bind(this),
        // hit: this.stateHit.bind(this),
        // dead: this.stateDead.bind(this),
    }

    constructor(inst: InstanceType.CustomButtonEntity) {
        this.inst = inst;
        this.state = States.default;
    }

    update(dt: number): void {
        this.activeTimer += dt;
        if (this.activeTimer >= this.activeInterval) {
            this.activeTimer = 0;
            this.state = States.default;
        }
    }

    onClick(eventName:string):void {
        if (this.state === States.disabled || this.state === States.active) return;
        this.eventList[eventName]();
        console.log("click")
        this.state = States.active;
    }

    spawnHero(selectedHero:IEntityStats){
        (globalThis as any).gameManager.spawnHero(selectedHero);
    }

    checkCollision(entity: InstanceType.MouseEntity): boolean {
        if(this.inst.testOverlap(entity)){
            console.log("hover")
        }
        return this.inst.testOverlap(entity);
    }

}


export default CustomButtonController;