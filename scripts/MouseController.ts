// entityController.ts

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

   get instance(): InstanceType.Entity | InstanceType.EnemyEntity | InstanceType.HeroEntity  {
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

    checkCollision(entity: InstanceType.CustomButton): boolean {
        return this.inst.testOverlap(entity);
    }

}


export default MouseController;