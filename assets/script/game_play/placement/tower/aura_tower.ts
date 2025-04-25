import { _decorator, Component, Node, ParticleSystem2D, Vec3 } from 'cc';
import { tower_component, tower_range_round_mixin,tower_attack_range_laser_mixin,tower_can_place_on_mixin } from '../tower_component';
import { level_tile_not_path_types } from '../../level_info';
const { ccclass, property } = _decorator;

@ccclass('aura_tower')
export class aura_tower extends tower_can_place_on_mixin(level_tile_not_path_types,"deny",tower_attack_range_laser_mixin(tower_range_round_mixin(tower_component))) {
    onLoad(): void {
        super.onLoad();
        let part=this.node.getChildByName("Aura").getComponent(ParticleSystem2D);
        part.startRadius=this.attack_radius;
        part.endRadius=this.attack_radius;
    }
    start() {
        super.start();
    }

    update(deltaTime: number) {
        super.update(deltaTime);
    }
}


