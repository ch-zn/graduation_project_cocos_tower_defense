import { _decorator, Component, Label, Node } from 'cc';
import { game_play } from '../game_play';
const { ccclass, property } = _decorator;

@ccclass('building_materials')
export class building_materials extends Component {
    text:Label;
    onLoad(): void {
        this.text=this.node.getChildByName("Text").getComponent(Label);
    }
    start() {

    }

    update(deltaTime: number) {
        this.text.string=`${game_play.instance.money.build}`;
    }
}


