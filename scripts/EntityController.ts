// entityController.ts

enum States {
    walk = "walk",
    attack = "attack",
    hit = "hit",
    dead = "dead"
}

class EntityController {
    private inst: InstanceType.Entity | InstanceType.EnemyEntity | InstanceType.HeroEntity;
    private speed: number;
    private isDead: boolean = false;
    private animations: string[] = [];
    private state = States.walk;

   get instance(): InstanceType.Entity | InstanceType.EnemyEntity | InstanceType.HeroEntity  {
        return this.inst;
    }

    get dead(): boolean {
        return this.isDead;
    }

    private hashState = {
        walk: this.stateWalk.bind(this),
        attack: this.stateAttack.bind(this),
        hit: this.stateHit.bind(this),
        dead: this.stateDead.bind(this),
    }

    constructor(inst: InstanceType.Entity | InstanceType.EnemyEntity | InstanceType.HeroEntity, speed: number = 120) {
        this.inst = inst;
        this.speed = speed;
        this.state = States.walk;
    }

    update(dt: number): void {
        if (this.isDead) return;

        this.hashState[this.state](dt);

    }

    checkCollision(entity: InstanceType.Entity): boolean {
        if (this.isDead) return false;
        return this.inst.testOverlap(entity);
    }

    onHitEntity(entity: InstanceType.Entity): void {
        this.destroy();
    }

    stateWalk(dt:number): void {
        this.inst.x -= this.speed * dt;

        if (this.inst.x < -this.inst.width) {
            this.state = States.dead;
        }
    }
    
    stateAttack(dt:number): void {

    }

    stateHit(dt:number): void {

    }

    stateDead(dt:number): void {
        this.destroy();
    }


    playAnimation(animName:string):void{
        this.inst.setAnimation( `${this.inst.templateName}_${animName}` , "beginning");
    }

    destroy(): void {
        this.isDead = true;
        this.inst.destroy();
    }
}


export default EntityController;