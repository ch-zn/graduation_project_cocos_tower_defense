import { _decorator, Component, Label, math, Node, UIRenderer } from 'cc';
import { game_play } from '../game_play';
import { placement_manager } from '../placement_manager';
const { ccclass, property } = _decorator;

@ccclass('energe_count')
export class energe_count extends Component {
    text:Label;
    genText:Label;
    costText:Label;
    onLoad(): void {
        this.text=this.node.getChildByName("Text").getComponent(Label);
        this.genText=this.node.getChildByPath("Delta/Generate").getComponent(Label);
        this.costText=this.node.getChildByPath("Delta/Consume").getComponent(Label);
    }
    start() {
    }
    update(deltaTime: number) {
        let chargeInfo=placement_manager.instance.last_charge_info;
        if(chargeInfo.cost>chargeInfo.gen)this.text.color=this.costText.color;
        else if(chargeInfo.cost<chargeInfo.gen)this.text.color=this.genText.color;
        else this.text.color=math.color(255,255,255,255);
        this.text.string=`${game_play.instance.money.charge}`;
        this.genText.string=`+${chargeInfo.gen}`;
        this.costText.string=`-${chargeInfo.cost}`;
    }
}


