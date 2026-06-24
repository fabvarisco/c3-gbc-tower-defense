

import { EntityMap} from "./globals.js"

export const heroes: EntityMap = {
    //Clerigo
    "hero_1": {
        hp: 8,
        maxHp: 9,
        attackSpeed: 1,
        speed: -10,
        damage: 3,
        entityName: "hero_1",
    },
    //Duelist
    "hero_2": {
        hp: 8,
        maxHp: 9,
        attackSpeed: 1,
        speed: 0,
        damage: 3,
        entityName: "hero_2",
    },
    //Mage
    "hero_3": {
        hp: 8,
        maxHp: 9,
        attackSpeed: 1,
        speed: 0,
        damage: 3,
        entityName: "hero_3",
    },
    //Dwarf
    "hero_4": {
        hp: 8,
        maxHp: 9,
        attackSpeed: 1,
        speed: 0,
        damage: 3,
        entityName: "hero_4",
    },
    //Tank
    "hero_5": {
        hp: 8,
        maxHp: 9,
        attackSpeed: 1,
        speed: 0,
        damage: 3,
        entityName: "hero_5",
    },
    //Warrior
    "hero_6": {
        hp: 8,
        maxHp: 9,
        attackSpeed: 1,
        speed: 0,
        damage: 3,
        entityName: "hero_6",
    },
    //Angel
    "hero_7": {
        hp: 8,
        maxHp: 9,
        attackSpeed: 1,
        speed: 0,
        damage: 3,
        entityName: "hero_7",
    },
}



export const enemiesMap: EntityMap = {
    "enemy_1": {
        hp: 10,
        maxHp: 10,
        attackSpeed: 2,
        speed: 20,
        damage: 100,
        entityName: "enemy_1",
    },
    "enemy_2": {
        hp: 10,
        maxHp: 10,
        attackSpeed: 2,
        speed: 8,
        damage: 3,
        entityName: "enemy_1",
    }
}



export const powers = {
    "healt_potion": {
        value:10,
        level:0,
        description:"",
        powerName:"",
        instanceType: ""
    },
    "ring_of_speed":{
        value:10,
        level:0,
        description:"",
        powerName:"",
        instanceType: ""
    },
    "more_gold":{
        value:10,
        level:0,
        description:"",
        powerName:"",
        instanceType: ""
    },
    "more_xp":{
        value:10,
        level:0,
        description:"",
        powerName:"",
        instanceType: ""
    },
    "meteor":{
        value:10,
        level:0,
        description:"",
        powerName:"",
        instanceType: ""
    },
    "thunder":{
        value:10,
        level:0,
        description:"",
        powerName:"",
        instanceType: ""
    },
    "hero_1":{
        value:10,
        level:0,
        description:"",
        powerName:"",
        instanceType: ""
    },
    "hero_2":{
        value:10,
        level:0,
        description:"",
        powerName:"",
        instanceType: ""
    },
    "hero_3":{
        value:10,
        level:0,
        description:"",
        powerName:"",
        instanceType: ""
    },
    "hero_4":{
        value:10,
        level:0,
        description:"",
        powerName:"",
        instanceType: ""
    },
    "hero_5":{
        value:10,
        level:0,
        description:"",
        powerName:"",
        instanceType: ""
    },
    "hero_6":{
        value:10,
        level:0,
        description:"",
        powerName:"",
        instanceType: ""
    },
    "hero_7":{
        value:10,
        level:0,
        description:"",
        powerName:"",
        instanceType: ""
    },        
}


export const stages:any = {
    "Game_1":{
        enemiesMap: [enemiesMap["enemy_1"]],
        enemyPortal: 20,
        spawnInterval: 10,
    },
    "Game_2":{
        enemiesMap: [enemiesMap["enemy_1"]],
        enemyPortal: 20,
        spawnInterval: 10,
    }
}

