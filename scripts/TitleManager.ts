// TitleManager.ts

import MouseController from "./MouseController.js";
import HeroFrameController from "./HeroFrameController.js";

import {heroes} from "./Entities.js";
import {IEntityStats} from "./globals.js";

class TitleManager {
    private runtime: IRuntime;
    private mouse: MouseController | null = null;
    private heroFrames: HeroFrameController[]  = [];
    private startText: InstanceType.StartGameText;
    private stageNumberTexts: InstanceType.StageNumberText[] = [];
    private tickListener: () => void;

    private readonly gridColumns: number = 4;
    private readonly gridStartX: number = 28;
    private readonly gridStartY: number = 48;
    private readonly gridSpacingX: number = 34;
    private readonly gridSpacingY: number = 34;

    constructor(runtime: IRuntime) {
        this.runtime = runtime;
        this.tickListener = () => this.tick();
        this.spawnMouse();
        this.setupListeners();
        this.startText = this.runtime.objects.StartGameText.getFirstInstance()!;
    }

    private setupListeners(): void {
        this.runtime.addEventListener("tick", this.tickListener);
    }

    private tick(): void {
        const dt = this.runtime.dt;

        if(this.mouse){
            this.mouse.update(dt);

            if(this.startText.isVisible){
                this.mouse.titleScreenCollisions(this.startText);
            }
            
            if(!this.startText.isVisible){
                for(const stageNumberText of this.stageNumberTexts){
                    this.mouse.titleScreenCollisions(stageNumberText)
                }
            }

            for(const heroFrame of this.heroFrames){
                this.mouse.checkCollisionWithHeroFrames(heroFrame);
            }
        }
    }

    spawnMouse(): void {
        const inst = this.runtime.objects.MouseEntity.createInstance("Main", 30, 60);
        this.mouse = new MouseController(inst, 120);
    }
    
    spawnStage(index:number):void {
        this.runtime.objects.Frame.createInstance("Main", 60, 68);
        const numberText = this.runtime.objects.StageNumberText.createInstance("Main", 60, 68);
        numberText.text = index.toString();
        this.stageNumberTexts.push(numberText);
    }

    goToStage(index:number){    
        this.destroy();
        this.runtime.goToLayout(`Game_${index}`);
    }

    createHeroFrames(): void {
        const heroEntries = Object.entries(heroes);

        heroEntries.forEach(([key, stats]: [string, IEntityStats], index: number) => {
            const column = index % this.gridColumns;
            const row = Math.floor(index / this.gridColumns);

            const x = this.gridStartX + column * this.gridSpacingX;
            const y = this.gridStartY + row * this.gridSpacingY;

            const inst = this.runtime.objects.HeroFrame.createInstance("Main", x, y);
            const controller = new HeroFrameController(inst, stats, index);

            this.heroFrames.push(controller);
        });
    }

    clearHeroFrames(): void {
        for (const frame of this.heroFrames) {
            frame.instance.destroy();
        }
        this.heroFrames = [];
    }

    clearStages(): void {
        for (const stageText of this.stageNumberTexts) {
            stageText.destroy();
        }
        this.stageNumberTexts = [];

        const frames = this.runtime.objects.Frame.getAllInstances();
        for (const frame of frames) {
            frame.destroy();
        }
    }

    selectHero(key: string): void {
        const heroStats = heroes[key];
        (globalThis as any).playerManager.setSelectedHero(heroStats);

        this.clearHeroFrames();
        this.stageSelect();
    }

    stageSelect():void {
        this.startText.isVisible = false;
        const stages = (globalThis as any).playerManager.getPlayer.stages;
        Object.values(stages).forEach((stage,index)=> {
            if(stage){
                this.spawnStage(index+1);
            }
        })
    }

    resetToStart(): void {
        this.clearHeroFrames();
        this.clearStages();
        this.startText.isVisible = true;
    }

    destroy(): void {
        this.runtime.removeEventListener("tick", this.tickListener);
    }
}


export default TitleManager;