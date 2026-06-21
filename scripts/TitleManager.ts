// TitleManager.ts

import MouseController from "./MouseController.js";

import GameManager from "./GameManager.js";

class TitleManager {
    private runtime: IRuntime;
    private mouse: MouseController | null = null;
    private startText: InstanceType.StartGameText;
    private stageNumberTexts: InstanceType.StageNumberText[] = [];
    private tickListener: () => void;
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
        console.log(index)
        if(index === 1){
            this.destroy();
            this.runtime.goToLayout("Game");
        }
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

    destroy(): void {
        this.runtime.removeEventListener("tick", this.tickListener);
    }
}


export default TitleManager;