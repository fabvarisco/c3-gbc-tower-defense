// PortalController.ts

import {PortalTypes} from "./globals.js";

class PortalController {
    private inst: PortalTypes;
    private isDead: boolean = false;
    private hp: number = 0;

    get instance(): PortalTypes {
        return this.inst;
    }

    constructor(
        inst: PortalTypes,
        hp: number
    ) {
        this.inst = inst;
        this.hp = hp;
    }

    update(dt: number): void {
        if (this.isDead) return;
        if(this.hp <= 0){
            this.destroy();
        }

        this.rotate(dt);
    }    

    destroy(): void {
        this.isDead = true;
        this.inst.destroy();
    }

    private rotate(dt: number): void {
        this.inst.angleDegrees += 10 * dt;         
    }

    public takeDamage(damage:number):void{
        this.hp -= damage;
    }

}

export default PortalController;