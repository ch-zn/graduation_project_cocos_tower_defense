import { _decorator, CCFloat, CCString, Component, director, game, Game, Node } from 'cc';
import { AbstractConstructor } from '../../../lib/mixins';
import { tower_component } from '../tower_component';
import { enemy_manager } from '../../enemy_manager';
import { enemy_component } from '../../enemy/enemy_component';
import { enemy_buff_damage, enemy_buff_speed } from '../../enemy/enemy_buff';
const { ccclass, property } = _decorator;


export function tower_defend_attack_mixin<T extends AbstractConstructor<tower_component>>(Base: T) {
    abstract class aclass extends Base {

        abstract add_enemy_buff(e:enemy_component);

        attack(deltaTime: number): void {
            let emenys=enemy_manager.instance.findAll(this.inAttackRange.bind(this));
            for(let e of emenys){
                this.add_enemy_buff(e);
            }
        }
    }
    return aclass;
}

export function tower_defend_in_same_tile_range_mixin<T extends AbstractConstructor<tower_component>>(Base: T) {
    abstract class aclass extends Base {
        inAttackRange(e: enemy_component) :boolean{
            let p=e.pos;
            return Math.round(p.x)==this.pos.x&&Math.round(p.y)==this.pos.y;
        }
    }
    return aclass;
}

export let tower_defend_buff={
    get buff_time(){
        return game.frameTime/1000;
    },
    speed(buff_name:string){
        return class enemy_buff_speed_by_defend_tower extends enemy_buff_speed{
            buff_name=buff_name;
            static buff_name=buff_name;
        }
    },
    damage(buff_name:string){
        return class enemy_buff_damage_by_defend_tower extends enemy_buff_damage{
            buff_name=buff_name;
            static buff_name=buff_name;
        }
    }

};
