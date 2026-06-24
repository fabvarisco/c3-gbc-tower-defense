export interface IEntityStats {
    hp: number,
    maxHp: number,
    attackSpeed: number,
    speed: number,
    damage: number,
    entityName: string,
}

export interface IPowers {
    name: string;
    effect: Function;
    sprite: any;
}

export interface IPlayer {
    powerUps: IPowers[];
    coins: number;
    life: number;
    level: number;
    xp: number;
    xpForNextLevel: number;
    stages: {
        easy: true,
        normal: false,
        hard:false,
        endless: false
    }
}

export type EntityMap = {
    [key: string]: IEntityStats;
}


export type Team = "hero" | "enemy";

export type PortalTypes = InstanceType.PlayerPortal | InstanceType.EnemyPortal;

export type PickupTypes = InstanceType.CoinEntity | InstanceType.XpEntity;
