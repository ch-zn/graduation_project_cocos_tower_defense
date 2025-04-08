import { _decorator, Button, Component, Node } from 'cc';
import { aseprite_bundle } from '../../resource/aseprite_bundle';
import { game_play } from '../game_play';
const { ccclass, property } = _decorator;

@ccclass('pause_button')
export class pause_button extends Component {
    onLoad(): void {
        let button=this.getComponent(Button);
        let image=this.getComponent(aseprite_bundle);
        button.hoverSprite=button.normalSprite=image.getFrame("Release");
        button.pressedSprite=image.getFrame("Press");
        button.node.on(Button.EventType.CLICK, this.callback, this);
    }
    callback (button: Button) {
        game_play.instance.switch_pause();
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


