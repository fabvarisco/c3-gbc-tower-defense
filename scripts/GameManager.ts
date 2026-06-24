// gameManager.ts

import EntityController from "./EntityController.js";
import MouseController from "./MouseController.js";
import CustomButtonController from "./CustomButtonController.js";
import PlayerManager from "./PlayerManager.js";
import PickupController from "./PickupController.js";
import PortalController from "./PortalController.js";
import UIManager from "./UIManager.js";

import {IEntityStats, IPlayer, EntityMap, Team } from "./globals.js"

import {stages} from "./Entities.js";


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
    private enemiesMap: IEntityStats[] = [];
    private playerPortal:PortalController | null = null;
    private enemyPortal:PortalController | null = null;
    private stageList:any = stages;
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
        this.uiManager = new UIManager(this.runtime);  
        this.createStage();
        this.setupListeners();
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

    spawnHero(heroStats:IEntityStats): EntityController {
        const inst = this.runtime.objects.Entity.createInstance("Main", this.playerPortal!.instance.x, this.playerPortal!.instance.y, true, "PlayerPortalTemplate")
        const controller = new EntityController(inst, "hero",heroStats);
        this.heroes.push(controller);
        return controller;
    }

    spawnEnemy(): EntityController {
        const enemyStats: IEntityStats = this.enemiesMap[Math.floor(Math.random() * this.enemiesMap.length)];
        console.log(enemyStats)
        const inst = this.runtime.objects.Entity.createInstance("Main", this.enemyPortal!.instance.x, this.enemyPortal!.instance.y);
        const controller = new EntityController(inst, "enemy", enemyStats);
        this.enemies.push(controller);
        return controller;
    }

    spawnPortal(team: Team, hp: number):void {
        if(team === "enemy"){
            const inst = this.runtime.objects.EnemyPortal.getFirstInstance()!;
            inst.width = 16;
            inst.height = 16;
            inst.depth = 10;
            const controller = new PortalController(inst, hp);
            this.enemyPortal = controller;
           
        }else{
            const inst = this.runtime.objects.PlayerPortal.getFirstInstance()!;
            inst.width = 16;
            inst.height = 16;
            inst.depth = 10;
            const controller = new PortalController(inst, hp);
            this.playerPortal = controller;
        }
    }

    tryDropLoot(x: number, y: number): void {
        const roll = Math.random() * 100;

        if (roll < this.coinDropRate) {
            this.dropCoin(x, y);
        } else if (roll < this.coinDropRate + this.xpDropRate) {
            this.dropXp(x, y);
        }
    }

    private createStage() {
        const stage = this.stageList[this.runtime.layout.name];

        this.enemiesMap = stage.enemiesMap;
        console.log(this.runtime.layout.name)
        console.log(this.stageList[this.runtime.layout.name]);
        this.spawnInterval = stage.spawnInterval;
        this.spawnPortal("enemy", stage.enemyPortal);
        this.spawnPortal("hero", 20); 

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

    private tick(): void {

        const dt = this.runtime.dt;
        this.spawnTimer += dt;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnEnemy();
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
            if(!this.mouse) break;
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
        
        if (this.playerPortal) {
            for (const enemy of this.enemies) {
                if (enemy.checkCollision(this.playerPortal.instance)) {
                    enemy.onHitEntity(this.playerPortal.instance);
                }
            }
        }

        if (this.enemyPortal) {
            for (const hero of this.heroes) {
                if (hero.checkCollision(this.enemyPortal.instance)) {
                    hero.onHitEntity(this.enemyPortal.instance);
                }
            }
        }

        for (const btns of this.customButtons){
            if(!this.mouse) break;
            btns.update(dt);
            this.mouse.checkCollision(btns)
            btns.checkCollision(this.mouse.instance as InstanceType.MouseEntity);
        }

        if(this.playerPortal){
            this.playerPortal.update(dt);
        }
        if(this.enemyPortal){
            this.enemyPortal.update(dt);
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