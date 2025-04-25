import { _decorator, CCFloat, CCString, Component, Node } from 'cc';
import { tower_defend_attack_mixin, tower_defend_buff, tower_defend_in_same_tile_range_mixin } from '../defend_tower_component';
import { tower_can_place_on_mixin,tower_attack_charge_generator_mixin, tower_component } from '../../tower_component';
import { enemy_component } from '../../../enemy/enemy_component';
import { aseprite_bundle } from 'db://assets/script/resource/aseprite_bundle';
import { level_tile_path_types } from '../../../level_info';
const { ccclass, property } = _decorator;

let speed_buff=tower_defend_buff.speed("belt_speed");
@ccclass('belt')
export class belt extends tower_can_place_on_mixin(level_tile_path_types,"deny",tower_defend_attack_mixin(tower_defend_in_same_tile_range_mixin(tower_attack_charge_generator_mixin(tower_component)))) {
    onCharge(charged: boolean) {
    }
    charge(energe: number): number {
        let e=this._enemy_count*this.per_enemy_per_tile_charge_generate;
        this._walked_enemy.clear();
        energe+=e;
        this.charged=e>0;
        this.onCharge(this.charged);
        return energe;
    }
        @property(CCFloat)
        defend_speed_rate:number;
        @property(CCFloat)
        per_enemy_per_tile_charge_generate:number;
        
        _walked_enemy:Set<enemy_component>=new Set();
        get _enemy_count(){return this._walked_enemy.size;}
        add_enemy_buff(e: enemy_component) {
            this._walked_enemy.add(e);
            e.addBuff(new speed_buff(tower_defend_buff.buff_time,this.defend_speed_rate));
        }
        _last_animate_is_charged=false;
        update(deltaTime: number): void {
            super.update(deltaTime);
            if(this._enemy_count>0){
                if(!this._last_animate_is_charged)this.getComponent(aseprite_bundle).setFrame("charged");
                this._last_animate_is_charged=true;
            }
            else {
                if(this._last_animate_is_charged)this.getComponent(aseprite_bundle).setFrame("normal");
                this._last_animate_is_charged=false;
            }
        }
        start(): void {
            this.charge_enabled=true;
        }
}


