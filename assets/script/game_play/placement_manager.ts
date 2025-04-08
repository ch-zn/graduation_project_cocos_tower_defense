import { _decorator, Component, Node,Prefab,CCString, Sprite, find } from 'cc';
import { global } from './global';
import { game_play } from './game_play';
import { tower_component } from './placement/tower_component';
const { ccclass, property } = _decorator;

@ccclass('PlacementData')
export class PlacementData{
    @property(CCString)
    name:string;
    @property(Prefab)
    prefabs:Prefab;
}

@ccclass('placement_manager')
export class placement_manager extends Component {
    /**
     * 可用建筑列表
     */
    @property([PlacementData])
    prefabs:PlacementData[]=[];
    /**
     * 当前场上的建筑
     */
    placement:Node[][];
    start() {
    }

    update(deltaTime: number) {
    }

    onLoad(): void {
        game_play.instance.display_change_event.on(game_play.DisplayChangeEventType.Position,function(pos){this.node.position=pos;},this);
        game_play.instance.display_change_event.on(game_play.DisplayChangeEventType.Scale,function(scale){this.node.scale=scale;},this);
    }
    onDestroy(): void {
        game_play.instance.display_change_event.off(game_play.DisplayChangeEventType.Position,function(pos){this.node.position=pos;},this);
        game_play.instance.display_change_event.off(game_play.DisplayChangeEventType.Scale,function(scale){this.node.scale=scale;},this);
    }


    /**
     * 用电器
     */
    charge_consumer:Set<tower_component>=new Set();
    /**
     * 发电机
     */
    charge_generator:Set<tower_component>=new Set();
    /**
     * 每刻发电/耗电统计
     */
    last_charge_info:{gen:number,cost:number}={gen:0,cost:0};
    
    /**
     * 处理炮塔充能
     */
    charge(){
        let energe=game_play.instance.money.charge;
        for(let gen of this.charge_generator){
            energe=gen.onCharge(energe);
        }
        this.last_charge_info.gen=energe-game_play.instance.money.charge;
        for(let consumer of this.charge_consumer){
            energe=consumer.onCharge(energe);
        }
        this.last_charge_info.cost=energe-this.last_charge_info.gen;
        game_play.instance.money.charge=energe;
    }


    // charge_delta_time:0.066=0.066; // 66ms 15次/s
    charge_delta_time:1=1; // 1000ms 1次/s
    charge_delay=0;
    protected lateUpdate(dt: number): void {
        if(game_play.instance.pause)return;
        this.charge_delay-=dt;
        if(this.charge_delay<=0){
            this.charge_delay+=this.charge_delta_time;
            this.charge();
        }
    }

    static get instance(){return find('Canvas/PlayGround/PlacementManager').getComponent(placement_manager);}
}


