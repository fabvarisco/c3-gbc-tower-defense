// gameManager.ts

import EntityController from "./EntityController.js";
import MouseController from "./MouseController.js";
import CustomButtonController from "./CustomButtonController.js";
import PlayerManager from "./PlayerManager.js";
import PickupController from "./PickupController.js";

import UIManager from "./UIManager.js";

import {IEntityStats, IPlayer} from "./globals.js"


const testEnemy:Readonly<IEntityStats>  = {
        hp: 20,
        maxHp: 10,
        attackSpeed: 1,
        speed: 5,
        entityName: "enemy_1",
        damage: 10,
}


const testHero:Readonly<IEntityStats>  = {
        hp: 100,
        maxHp: 10,
        attackSpeed: 1,
        speed: -5,
        entityName: "hero_1",
        damage: 1,
}

class GameManager {
    private runtime: IRuntime;
    private heroes: EntityController[] = [];
    private enemies: EntityController[] = [];
    private pickups: PickupController[] = [];
    private customButtons: CustomButtonController[] = [];
    private uiManager: UIManager;
    private player: PlayerManager = new PlayerManager()
    private tickListener: () => void;
    private coinDropRate:number = 33;
    private xpDropRate:number = 33;

    private mouse: MouseController | null = null;

    private spawnTimer: number = 0;
    private spawnInterval: number = 5;


    get getPlayer(): IPlayer {
        return this.player.getPlayer;
    }

    constructor(runtime: IRuntime) {
        this.runtime = runtime;
        this.tickListener = () => this.tick();
        this.spawnMouse();
        this.createButton();
        this.setupListeners();
        this.uiManager = new UIManager(this.runtime);
    }

    private setupListeners(): void {
        this.runtime.addEventListener("tick", this.tickListener);
    }

    createButton():void {
        const inst = this.runtime.objects.CustomButtonEntity.createInstance("Main", 10, 110);
        this.customButtons.push(new CustomButtonController(inst));
    }

    spawnHitbox (entityController: EntityController): void {
        const hitbox = this.runtime.objects.Hitbox.createInstance(
            "Main",
            entityController.instance.x,
            entityController.instance.y
        );
        hitbox.isVisible = true;

        const targets = entityController.getTeam === "hero" ? this.enemies : this.heroes;


        for (const target of targets) {
            if (hitbox.testOverlap(target.instance)) {
                target.takeDamage(entityController.getStats.damage)
                break;
            }
        }
        
        hitbox.destroy();
    }

    spawnMouse(): void {
        const inst = this.runtime.objects.MouseEntity.createInstance("Main", 30, 60);
        this.mouse = new MouseController(inst, 120);
    }

    spawnHero(x: number, y: number): EntityController {
        const inst = this.runtime.objects.Entity.createInstance("Main", x, y);

        const controller = new EntityController(inst, "hero", testHero);
        this.heroes.push(controller);
        return controller;
    }

    spawnEnemy(x: number, y: number): EntityController {
        const inst = this.runtime.objects.Entity.createInstance("Main", x, y);
        const controller = new EntityController(inst, "enemy", testEnemy);
        this.enemies.push(controller);
        return controller;
    }

    private dropCoin(x: number, y: number): PickupController {
        const inst = this.runtime.objects.CoinEntity.createInstance("Main", x, y);
        const controller = new PickupController(inst);
        this.pickups.push(controller);
        return controller;
    }

    private dropXp(x: number, y: number): PickupController {
        const inst = this.runtime.objects.XpEntity.createInstance("Main", x, y);
        const controller = new PickupController(inst);
        this.pickups.push(controller);
        return controller;
    }

    tryDropLoot(x: number, y: number): void {
        const roll = Math.random() * 100;

        if (roll < this.coinDropRate) {
            this.dropCoin(x, y);
        } else if (roll < this.coinDropRate + this.xpDropRate) {
            this.dropXp(x, y);
        }
    }

    private tick(): void {
        const dt = this.runtime.dt;
        this.spawnTimer += dt;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnEnemy(140,71);
        }

        for (const hero of this.heroes) {
            hero.update(dt);
        }
        for (const enemy of this.enemies) {
            enemy.update(dt);
        }

        this.uiManager.update(this.player.getPlayer)

        if(this.mouse){
            this.mouse.update(dt);
        }

        for (const pickup of this.pickups){
            if(!this.mouse) return;
            this.mouse.checkCollision(pickup)            
        }

        for (const hero of this.heroes) {
            for (const enemy of this.enemies) {
                if (hero.checkCollision(enemy.instance as InstanceType.Entity) ) {
                    hero.onHitEntity(enemy.instance as InstanceType.Entity);
                    enemy.onHitEntity(hero.instance as InstanceType.Entity);
                    break;
                }
            }
        }

        for (const btns of this.customButtons){
            if(!this.mouse) return;
            btns.update(dt);
            this.mouse.checkCollision(btns)
            btns.checkCollision(this.mouse.instance as InstanceType.MouseEntity);
        }

        this.heroes = this.heroes.filter(h => !h.dead);
        this.enemies = this.enemies.filter(e => !e.dead);
        this.pickups = this.pickups.filter(c => !c.dead)
    }


    destroy(): void {
        this.runtime.removeEventListener("tick", this.tickListener);
    }
}


export default GameManager;