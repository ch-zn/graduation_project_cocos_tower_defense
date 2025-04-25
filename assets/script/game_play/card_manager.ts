import { _decorator, Component, find, instantiate, Node, Prefab, UITransform, Vec3, view } from 'cc';
import { game_play } from './game_play';
import { placement_manager } from './placement_manager';
import { card_component } from './card_component';
const { ccclass, property } = _decorator;

function reposition(pos:Vec3){
    let total_size=view.getVisibleSize();
    this.node.getChildByName("FixPosition").position=new Vec3(-total_size.width/2-pos.x,total_size.height/2-pos.y,-pos.z);
}
function rescale(scale:Vec3){this.node.scale=new Vec3(1/scale.x,1/scale.y,1);}

@ccclass('card_manager')
export class card_manager extends Component {
    @property(Prefab)
    cardPrefab:Prefab;
    prefab:Prefab;
    onLoad(): void {
        game_play.instance.display_change_event.on(game_play.DisplayChangeEventType.Position,reposition,this);
        game_play.instance.display_change_event.on(game_play.DisplayChangeEventType.Scale,rescale,this);

        let count=0;
        let fix_pos_node=this.node.getChildByName("FixPosition");
        for(let tower_name of game_play.instance.chosen_tower){
            let tower_prefab=placement_manager.instance.towers.find((data)=>data.name==tower_name).prefabs;
            let card_node=instantiate(this.cardPrefab);
            let card=card_node.getComponent(card_component);
            card.setPrefab(tower_prefab);
            card_node.position=new Vec3(0,0-count*card_node.getComponent(UITransform).contentSize.height,0);
            fix_pos_node.addChild(card_node);
            count++;
        }

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


