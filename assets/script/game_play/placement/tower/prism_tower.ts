import { _decorator, Component, math, Node, ParticleSystem2D, UIOpacity, Vec3 } from 'cc';
import { tower_can_place_on_mixin,tower_attack_single_laser_mixin, tower_component, tower_range_round_mixin } from '../tower_component';
import { level_tile_not_path_types } from '../../level_info';
const { ccclass, property } = _decorator;

@ccclass('prism_tower')
export class prism_tower extends tower_can_place_on_mixin(level_tile_not_path_types,"deny",tower_attack_single_laser_mixin(tower_range_round_mixin(tower_component))) {
        start() {
            super.start();
        }
    
        update(deltaTime: number) {
            super.update(deltaTime);
            this.beamAttack();
            // console.log(`enemy : ${this.targets[0].pos} ${this.targets[0].HP}`);
        }

        get _beam(){
            return this.node.getChildByName("Beam");
        }
        setBeamVisible(b:boolean){
            this._beam.getComponent(UIOpacity).opacity=b?255:0;
            
        }
        beamAttack(){
            if(this.target?.isValid){
                let part=this._beam.getComponent(ParticleSystem2D);
                let target_pos=this.target.pos;
                this._beam.position=new Vec3((target_pos.x-this.pos.x)/2,(target_pos.y-this.pos.y)/2,0);
                part.posVar.x=Math.hypot((target_pos.x-this.pos.x),target_pos.y-this.pos.y)/2;
                this._beam.angle=Math.atan2(target_pos.y-this.pos.y,target_pos.x-this.pos.x)*180/Math.PI;
                // console.log(`${target_pos.x},${target_pos.y}  len:${Math.hypot((target_pos.x-this.pos.x),target_pos.y-this.pos.y)/2} ang:${Math.atan2(target_pos.y-this.pos.y,target_pos.x-this.pos.x)}`)

                this.setBeamVisible(true);
            }else{
                this.setBeamVisible(false);
                this._beam.getComponent(ParticleSystem2D).posVar.x=0;
            } 
        }
}


