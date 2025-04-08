import { _decorator, Component, EventTouch, Input, Node, Prefab } from 'cc';
import { card_manager } from './card_manager';
const { ccclass, property } = _decorator;

@ccclass('card_component')
export class card_component extends Component {
    @property(Prefab)
    prefab:Prefab;
    protected onLoad(): void {
        this.node.on(Input.EventType.TOUCH_START,this.onTouch,this);
    }
    protected onDestroy(): void {
        this.node.off(Input.EventType.TOUCH_START,this.onTouch,this);
    }
    start() {

    }

    update(deltaTime: number) {
        
    }

    onTouch(e:EventTouch){
        card_manager.instance.prefab=this.prefab;
        console.log("selected");
    }
}


