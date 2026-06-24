// entityController.ts

import CustomButtonController from "./CustomButtonController.js";
import PickupController from "./PickupController.js";
import HeroFrameController from "./HeroFrameController.js";

enum States {
    default = "default",
    click = "walk",
    hover = "attack",
    active = "hit",
}

class MouseController {
    private inst: InstanceType.MouseEntity;
    private speed: number;
    private state = States.default;
    private keyboard: any;
    private wasKeyDown: boolean = false;
   
    get instance(): InstanceType.MouseEntity  {
        return this.inst;
    }

    private hashState = {
        // walk: this.stateWalk.bind(this),
        // attack: this.stateAttack.bind(this),
        // hit: this.stateHit.bind(this),
        // dead: this.stateDead.bind(this),
    }

    constructor(inst: InstanceType.MouseEntity, speed: number = 120) {
        
        this.inst = inst;
        this.speed = speed;
        this.state = States.default;
    }
        
    private checkKeyPressedOnce(): boolean {
        const isDown = this.keyboard.isKeyDown("KeyZ");
        const justPressed = isDown && !this.wasKeyDown;
        this.wasKeyDown = isDown;
        return justPressed;
    }

    hoveredButton(btn : CustomButtonController):void {
    }

    update(dt: number): void {
        if (!this.keyboard) {
            this.keyboard = this.inst.runtime.keyboard;
        }
        this.movement(dt);
    }


    movement(dt: number): void {
        let dx = 0;
        let dy = 0;

        if (this.keyboard.isKeyDown("ArrowLeft")) {
            dx = -1;
        } else if (this.keyboard.isKeyDown("ArrowRight")) {
            dx = 1;
        }

        if (dx === 0) {
            if (this.keyboard.isKeyDown("ArrowUp")) {
                dy = -1;
            } else if (this.keyboard.isKeyDown("ArrowDown")) {
                dy = 1;
            }
        }

        if (dx !== 0 || dy !== 0) {
            this.inst.x += dx * this.speed * dt;
            this.inst.y += dy * this.speed * dt;
        }
    }

    checkCollision(controller: CustomButtonController | PickupController): void {
        if(controller instanceof(CustomButtonController)) {


            if(this.inst.testOverlap(controller.instance) && this.checkKeyPressedOnce()){
            
                controller.spawnHero((globalThis as any).playerManager.selectedHero);
            }

        }else if (controller instanceof(PickupController)){
            if(this.checkKeyPressedOnce() && this.inst.testOverlap(controller.instance)){
                console.log("Mouse collect")
                controller.collect();
            }
        }
    }


    checkCollisionWithHeroFrames(controller: HeroFrameController){
        if(this.inst.testOverlap(controller.instance) && this.checkKeyPressedOnce()){
            (globalThis as any).playerManager.selectedHero = controller.getheroStats;
            (globalThis as any).titleManager.clearHeroFrames();

            (globalThis as any).titleManager.stageSelect();
            
        }
        controller.hover(this.inst.testOverlap(controller.instance))
    }

    titleScreenCollisions(instance: InstanceType.StartGameText | InstanceType.StageNumberText){
        const typeName = instance.objectType.name;

        if (typeName === "StartGameText") {
            if(this.inst.testOverlap(instance) && this.checkKeyPressedOnce() ){
                (globalThis as any).titleManager.createHeroFrames();
            }

        } else if (typeName === "StageNumberText") {
            if(this.inst.testOverlap(instance) && this.checkKeyPressedOnce() ){
                (globalThis as any).titleManager.goToStage(Number(instance.text));

            }
        }

    }
}


export default MouseController;