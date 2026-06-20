// gameManager.ts

import EntityController from "./EntityController.js";
import MouseController from "./MouseController.js";


class GameManager {
    private runtime: IRuntime;
    private heroes: EntityController[] = [];
    private enemies: EntityController[] = [];
    private mouse: MouseController | null = null;

    private spawnTimer: number = 0;
    private spawnInterval: number = 5;


    constructor(runtime: IRuntime) {
        this.runtime = runtime;
        this.spawnMouse();
        this.setupListeners();
    }

    private setupListeners(): void {
        this.runtime.addEventListener("tick", () => this.tick());
    }

    spawnMouse(): void {
        const inst = this.runtime.objects.MouseEntity.createInstance("Main", 30, 60);
        this.mouse = new MouseController(inst, 120);
    }

    spawnHero(x: number, y: number): EntityController {
        const inst = this.runtime.objects.HeroEntity.createInstance("Main", x, y);

        const controller = new EntityController(inst, -30);
        this.heroes.push(controller);
        return controller;
    }

    spawnEnemy(x: number, y: number): EntityController {
        const inst = this.runtime.objects.EnemyEntity.createInstance("Main", x, y);

        const controller = new EntityController(inst, 30);
        this.enemies.push(controller);
        return controller;
    }

    private tick(): void {
        const dt = this.runtime.dt;
        this.spawnTimer += dt;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnEnemy(140,71);
            this.spawnHero(0,71);
            console.log("SPAWN ATIVADO");
        }

        for (const hero of this.heroes) {
            hero.update(dt);
        }
        for (const enemy of this.enemies) {
            enemy.update(dt);
        }

        if(this.mouse){
            this.mouse.update(dt);
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

        this.heroes = this.heroes.filter(h => !h["isDead"]);
        this.enemies = this.enemies.filter(e => !e["isDead"]);
    }
}


export default GameManager;