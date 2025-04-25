import { _decorator, Button, Component, game, Node } from 'cc';
import { aseprite_bundle } from '../../resource/aseprite_bundle';
import { game_play } from '../game_play';
const { ccclass, property } = _decorator;

@ccclass('pause_button')
export class pause_button extends Component {
    onLoad(): void {
        this.updateButtonFrame(false);
        this.node.on(Button.EventType.CLICK, this.callback, this);
    }
    updateButtonFrame(paused:boolean){
        let button=this.getComponent(Button);
        let image=this.getComponent(aseprite_bundle);
        let suffix=paused?"Resume":"Pause";
        button.normalSprite=button.normalSprite=image.getFrame(`Release${suffix}`);
        console.log(`${paused} ${image.getFrame(`Release${suffix}`)}`);
        let all=image.frames;
        for(let t in all){console.log(t);}
        button.hoverSprite=button.normalSprite=image.getFrame(`Release${suffix}`);
        button.pressedSprite=image.getFrame(`Press${suffix}`);
        
    }
    callback (button: Button) {
        game_play.instance.switch_pause();
        this.updateButtonFrame(game_play.instance.pause);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


