import { _decorator, Component, find, Graphics, math, Node, UITransform } from 'cc';
import { tower_attack_single_laser_mixin, tower_component, tower_range_round_mixin } from './tower_component';
const { ccclass, property } = _decorator;

@ccclass('laser_tower')
export class laser_tower extends tower_range_round_mixin(tower_attack_single_laser_mixin(tower_component)) {
    start() {
    }

    update(deltaTime: number) {
        super.update(deltaTime);
        if(this.target!=null){
            let g=find("Canvas/PlayGround/Graphics").getComponent(Graphics);
            let thisp=this.getComponent(UITransform).convertToWorldSpaceAR(new math.Vec3(0,0,0)).toVec2();
            g.moveTo(thisp.x,thisp.y);
            let thatp=this.target.getComponent(UITransform).convertToWorldSpaceAR(new math.Vec3(0,0,0)).toVec2();
            g.lineTo(thatp.x,thatp.y);
        }
    }
}


