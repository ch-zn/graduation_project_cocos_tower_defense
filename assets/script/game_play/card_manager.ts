import { _decorator, Component, find, Node, Prefab, Vec3 } from 'cc';
import { game_play } from './game_play';
const { ccclass, property } = _decorator;

function reposition(pos:Vec3){this.node.getChildByName("FixPosition").position=new Vec3(-1280/2-pos.x,720/2-pos.y,-pos.z);}
function rescale(scale:Vec3){this.node.scale=new Vec3(1/scale.x,1/scale.y,1);}

@ccclass('card_manager')
export class card_manager extends Component {
    prefab:Prefab;
    onLoad(): void {
        game_play.instance.display_change_event.on(game_play.DisplayChangeEventType.Position,reposition,this);
        game_play.instance.display_change_event.on(game_play.DisplayChangeEventType.Scale,rescale,this);
    }
    onDestroy(): void {
        game_play.instance.display_change_event.off(game_play.DisplayChangeEventType.Position,reposition,this);
        game_play.instance.display_change_event.off(game_play.DisplayChangeEventType.Scale,rescale,this);
    }
    start() {

    }

    update(deltaTime: number) {
        
    }

    static get instance(){return find('Canvas/PlayGround/TileManager/CardManager').getComponent(card_manager);}
}


