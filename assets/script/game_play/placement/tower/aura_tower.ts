import { _decorator, Component, Node, ParticleSystem2D, Vec3 } from 'cc';
import { tower_component, tower_range_round_mixin,tower_attack_range_laser_mixin } from '../tower_component';
const { ccclass, property } = _decorator;

@ccclass('aura_tower')
export class aura_tower extends tower_attack_range_laser_mixin(tower_range_round_mixin(tower_component)) {
    onLoad(): void {
        let part=this.node.getChildByName("Aura").getComponent(ParticleSystem2D);
        part.startRadius=this.attack_radius;
        part.endRadius=this.attack_radius;
    }
    start() {
        super.start();
    }

    update(deltaTime: number) {
        super.update(deltaTime);
        // console.log(`enemy : ${this.targets[0].pos} ${this.targets[0].HP}`);
    }
}


