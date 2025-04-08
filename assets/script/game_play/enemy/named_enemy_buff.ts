import { _decorator, Component, Node } from 'cc';
import { enemy_buff } from './enemy_buff';
const { ccclass, property } = _decorator;

export class named_enemy_buff{
    static named_buff:{[index:string]:new(time:number,level:number)=>enemy_buff}={

    };
    static byName(name:string,time:number,level:number){
        return new this.named_buff[name](time,level);
    }
}

class half_life extends enemy_buff{
    rate:number;
    constructor(time:number,level:number){
        super(0);
        this.rate=level;
    }
    apply(): void {
        this.enemy.maxHP*=this.rate;
        this.enemy.HP*=this.rate;
        this.enemy.defense*=this.rate;
        this.enemy.maxDefense*=this.rate;
    }
}
named_enemy_buff.named_buff["half_life"]=half_life;
