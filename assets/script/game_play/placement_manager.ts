import { _decorator, Component, Node,Prefab,CCString, Sprite, find, instantiate } from 'cc';
import { global } from './global';
import { game_play } from './game_play';
import { tower_component } from './placement/tower_component';
import { level_data, level_tile_type } from './level_info';
import { building_component } from './placement/building_component';
const { ccclass, property } = _decorator;

@ccclass('PlacementData')
export class PlacementData{
    @property(CCString)
    name:string;
    @property(Prefab)
    prefabs:Prefab;
}

export class PlacementSlotData{
    tower:tower_component|null=null;
    building:building_component|null=null;
    tile_type:level_tile_type=null;
}

@ccclass('placement_manager')
export class placement_manager extends Component {
    /**
     * 可用建筑列表
     */
    @property([PlacementData])
    towers:PlacementData[]=[];
    @property([PlacementData])
    buildings:PlacementData[]=[];
    /**
     * 当前场上的建筑
     */
    placement:PlacementSlotData[][];
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

    loadMap(t:level_data){
        this.placement=new Array(t.size.w);
        for(let i=0;i<t.size.w;i++){
            this.placement[i]=(new Array<PlacementSlotData>(t.size.h));
            for(let j=0;j<t.size.h;j++){
                this.placement[i][j]={tile_type:t.tiles[i][j].type,tower:null,building:null};
            }
        }
    }

    placementAt(x:number,y:number){
        return this.placement[x][y];
    }

    tryPlaceAt(tower:Prefab,x:number,y:number){
        let tower_can_place_here=(tower.data as Node).getComponent(tower_component).canPlaceOn(placement_manager.instance.placementAt(x,y));
        if(!tower_can_place_here)return;
        let t=instantiate(tower);
        t.getComponent(tower_component).setPos({x:x,y:y});
        this.placement[x][y].tower=t.getComponent(tower_component);
        this.node.addChild(t);
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
            energe=gen.charge(energe);
        }
        this.last_charge_info.gen=energe-game_play.instance.money.charge;
        for(let consumer of this.charge_consumer){
            energe=consumer.charge(energe);
        }
        this.last_charge_info.cost=energe-game_play.instance.money.charge-this.last_charge_info.gen;
        game_play.instance.money.charge=Math.max(energe,0);
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


