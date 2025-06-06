import { _decorator, Component, Node } from 'cc';
import { enemy_component } from './enemy_component';
import { Constructor } from '../../lib/mixins';
const { ccclass, property } = _decorator;

export abstract class enemy_buff {
    time_left:number;
    level:number=1;
    enemy:enemy_component;
    static readonly buff_name:string;
    readonly buff_name:string;
    constructor(time:number){
        this.time_left=time;
    }

    apply() {}

    update(deltaTime: number) {}

    post_update(){}

    end(){}

    lapse(){return this.time_left<=0;}

    _buff_apply(e:enemy_component){
        this.enemy=e;
        this.apply();
    }

    _buff_update(deltaTime: number){
        if(deltaTime>=this.time_left){
            this.update(this.time_left);
            this.end();
        }else {
            this.update(deltaTime);
        }
        this.time_left-=deltaTime;
    }


}

export class enemy_buff_speed extends enemy_buff{
    speed:number;
    _old_speed:number;
    static readonly buff_name:string="speed";
    readonly buff_name:string="speed";
    constructor(time:number,speed:number){
        super(time);
        this.speed=speed;
    }
    update(deltaTime: number): void {
        this._old_speed=this.enemy.speed;
        this.enemy.speed*=this.speed;
    }
    post_update(): void {
        this.enemy.speed=this._old_speed;
    }
}

export class enemy_buff_damage extends enemy_buff{
    damage:number;
    damage_type:string;
    static readonly buff_name:string="damage";
    readonly buff_name:string="damage";
    constructor(time:number,damage:number,damage_type:string){
        super(time);
        this.damage=damage;
        this.damage_type=damage_type;
    }
    update(deltaTime: number): void {
        this.enemy.attack([{type:this.damage_type,hp:this.damage*deltaTime}]);
    }
    post_update(): void {
    }
}