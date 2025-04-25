import { _decorator, Component, EventTouch, Input, instantiate, Node, Prefab, Vec3 } from 'cc';
import { card_manager } from './card_manager';
import { tower_component } from './placement/tower_component';
import { aseprite_bundle } from '../resource/aseprite_bundle';
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

    setPrefab(p:Prefab){
        this.prefab=p;
        let pic=instantiate(p);

        let n=p.data as Node;

        pic.getComponent(tower_component).displayCard();
        // pic.scale=new Vec3(64,64,1);
        this.node.getChildByName("FixPos").addChild(pic);
    }
}


