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


