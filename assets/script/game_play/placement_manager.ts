import { _decorator, Component, Node,Prefab,CCString, Sprite } from 'cc';
import { global } from './global';
import { game_play } from './game_play';
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
    @property([PlacementData])
    prefabs:PlacementData[]=[];
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
}


