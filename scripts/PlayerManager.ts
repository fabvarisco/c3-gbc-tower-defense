
import {IPlayer, IEntityStats} from "./globals.js";

class PlayerManager {
    public selectedHero: IEntityStats | null = null; 
    private player: IPlayer = {
        coins: 0,
        powerUps: [],
        level: 0,
        life: 3,
        xp: 0,
        xpForNextLevel: 10,
        stages: {
            easy: true,
            normal: false,
            hard: false,
            endless: false,
        },
    };

    constructor(){

    }

    get getPlayer():IPlayer {
        return this.player;
    }
}

export default PlayerManager;