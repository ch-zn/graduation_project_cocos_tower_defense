import { _decorator, CCFloat, CCString, Component, Node } from 'cc';
import { tower_defend_attack_mixin, tower_defend_buff, tower_defend_in_same_tile_range_mixin } from '../defend_tower_component';
import { tower_can_place_on_mixin,tower_attack_chargeable_mixin, tower_component } from '../../tower_component';
import { enemy_component } from '../../../enemy/enemy_component';
import { level_tile_path_types } from '../../../level_info';
const { ccclass, property } = _decorator;

let speed_buff=tower_defend_buff.speed("iron_web_speed");
let damage_buff=tower_defend_buff.damage("iron_web_damage");

@ccclass('iron_web')
export class iron_web extends tower_can_place_on_mixin(level_tile_path_types,"deny",tower_attack_chargeable_mixin(tower_defend_attack_mixin(tower_defend_in_same_tile_range_mixin(tower_component)))) {
    @property(CCFloat)
    damage_charged:number;
    @property(CCString)
    damage_type_charged:string;
    @property(CCFloat)
    defend_speed_rate:number;

    add_enemy_buff(e: enemy_component) {
        e.addBuff(new speed_buff(tower_defend_buff.buff_time,this.defend_speed_rate));
        if(this.charged)e.addBuff(new damage_buff(tower_defend_buff.buff_time,this.damage_charged,this.damage_type_charged));
    }

    onCharge(charged:boolean){}


    update(deltaTime: number): void {
        super.update(deltaTime);
    }


}


