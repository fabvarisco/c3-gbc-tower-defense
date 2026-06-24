// HeroFrameController.ts

import {heroes} from "./Entities.js";
import {IEntityStats} from "./globals.js";

class HeroFrameController {
    private inst: InstanceType.HeroFrame;
    private heroStats: IEntityStats;

    get getheroStats():IEntityStats {
        return this.heroStats;
    }

    get instance(): InstanceType.HeroFrame {
        return this.inst;
    }

    constructor(
        inst: InstanceType.HeroFrame,
        stats: IEntityStats,
        index:number
    ) {
        this.inst = inst;
        this.heroStats = stats;

        this.inst.animationFrame = index;
        this.inst.animationSpeed = 0;
        this.inst.effects.Pulse.isActive = false;
    }

    hover(value:boolean):void{ 
        this.inst.effects.Pulse.isActive = value;
    }

    update(dt:number){

    }

}

export default HeroFrameController;