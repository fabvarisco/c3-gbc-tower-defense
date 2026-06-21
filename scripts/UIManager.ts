// uiManager.ts

import {IPlayer} from "./globals.js"

class UIManager {
    private runtime: IRuntime;
    private coinsText: InstanceType.CoinText;

    constructor(runtime: IRuntime) {
        this.runtime = runtime;

        this.coinsText = this.runtime.objects.CoinText.getFirstInstance()!;
    }

    update(player: IPlayer): void {
        this.setCoins(player.coins);
    }

    setCoins(coins: number): void {
        this.coinsText.text = `${coins}`;
    }
}

export default UIManager;