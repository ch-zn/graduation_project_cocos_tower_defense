import { _decorator, Component, Node,Prefab,CCString, Sprite } from 'cc';
import { global } from './global';
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
}


