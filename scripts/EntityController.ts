// entityController.ts

import {IEntityStats, Team, PortalTypes } from "./globals.js"


enum States {
    walk = "walk",
    attack = "attack",
    hit = "hit",
    dead = "dead"
}


class EntityController {
    private inst: InstanceType.Entity; 
    private isDead: boolean = false;
    private animations: string[] = [];
    private _state = States.walk;
    private team: Team;

    private stats:IEntityStats = {
        hp: 10,
        maxHp: 10,
        attackSpeed: 1,
        speed: 30,
        entityName: "",
        damage: 10,
    }

    private attackTimer: number = 0;
    private hasSpawnedHitbox: boolean = false;

    get instance(): InstanceType.Entity {
        return this.inst;
    }

    get getTeam(): Team {
        return this.team;
    }

    get getStats():IEntityStats {
        return this.stats;
    }

    get dead(): boolean {
        return this.isDead;
    }

    get state(): States {
        return this._state;
    }

    set state(newState: States) {
        if (this._state === newState) return;

        this._state = newState;
        this.playAnimation(newState);
    }

    private hashState = {
        walk: this.stateWalk.bind(this),
        attack: this.stateAttack.bind(this),
        hit: this.stateHit.bind(this),
        dead: this.stateDead.bind(this),
    }

    constructor(
        inst: InstanceType.Entity,
        team: Team = "enemy",
        stats: IEntityStats
    ) {
        this.inst = inst;
        this.inst.behaviors.Platform.isDefaultControls = false;
        this.stats = {...stats};
        this.team = team;
        this.state = States.walk; 
        this.playAnimation(States.walk);
    }

    update(dt: number): void {
        if (this.isDead) return;
        if(this.stats.hp <= 0){
            this._state = States.dead;
        }

        this.hashState[this._state](dt);
    }

    checkCollision(entity: InstanceType.Entity | PortalTypes): boolean {
        console.log(entity.templateName)
        if (this.isDead) return false;
        return this.inst.testOverlap(entity);
    }

    onHitEntity(entity: InstanceType.Entity | PortalTypes ): void {
        if (this._state === States.attack) return;

        this.state = States.attack; 
        this.attackTimer = 0;
        this.hasSpawnedHitbox = false;
    }

    stateWalk(dt: number): void {
        this.inst.x -= this.stats.speed * dt;

        if (this.inst.x < -this.inst.width) {
            this.state = States.dead;
        }
    }

    stateAttack(dt: number): void {
        const attackDuration = 1 / this.stats.attackSpeed;

        this.attackTimer += dt;

        if (!this.hasSpawnedHitbox && this.attackTimer >= attackDuration) {
            (globalThis as any).gameManager.spawnHitbox(this);
            this.hasSpawnedHitbox = true;
        }

        if (this.attackTimer >= attackDuration) {
            this.state = States.walk;
        }
    }

    stateHit(dt: number): void {

    }

    stateDead(dt: number): void {
        if(this.team === "enemy"){
            (globalThis as any).gameManager.tryDropLoot(this.inst.x,this.inst.y);
        }
        this.destroy();
    }

    public takeDamage(damage:number):void{
        this.stats.hp -= damage;
    }

    playAnimation(animName: string): void {
        this.inst.setAnimation(`${this.stats.entityName}_${animName}`, "beginning");
    }

    destroy(): void {
        this.isDead = true;
        this.inst.destroy();
    }
}

export default EntityController;