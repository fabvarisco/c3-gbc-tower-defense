// CoinController.ts

import {PickupTypes} from "./globals.js"

class PickupController {
    private inst: PickupTypes;
    private isDead: boolean = false;

   get instance(): PickupTypes  {
        return this.inst;
    }

    constructor(inst: PickupTypes) {
        this.inst = inst;
    }

    get dead(): boolean {
        return this.isDead;
    }

    collect(): void {
        const typeName = this.inst.objectType.name;

        if (typeName === "CoinEntity") {
            this.collectCoin();
        } else if (typeName === "XpEntity") {
            this.collectXp();
        }
    }

    collectCoin(): void {
        console.log("collectCoin");
        (globalThis as any).gameManager.getPlayer.coins += 1;
        this.isDead = true;
        this.inst.destroy();
    }

    collectXp(): void {
        console.log("collectXp");
        (globalThis as any).gameManager.getPlayer.xp += 1;
        this.isDead = true;
        this.inst.destroy();
    }

}


export default PickupController;