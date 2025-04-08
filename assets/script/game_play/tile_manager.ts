import { _decorator, Canvas, Component, EventTouch, find, Input, instantiate, Node, Prefab, UITransform, Vec2, Vec3, view } from 'cc';
import { tile, TileState } from './tile';
import { global } from './global';
import { game_play } from './game_play';
import { level_data } from './level_info';
import { card_manager } from './card_manager';
import { tower_component } from './placement/tower_component';
import { placement_manager } from './placement_manager';
const { ccclass, property } = _decorator;

export class TileMap{
    size:{w:number,h:number};
    ground:Array<Array<string>>;
    item:Array<Array<string | null>>;
}

function reposition(pos){this.node.position=pos;}
function rescale(scale){this.node.scale=scale;}

@ccclass('tile_manager')
export class tile_manager extends Component {
    map:Map<Vec2,Node>=new Map();
    @property(Prefab)
    prefab:Prefab;
    onLoad(): void {
        this.node.on(Input.EventType.TOUCH_START,this.onTouch,this);
        this.node.on(Input.EventType.TOUCH_END,this.onTouchEnd,this);
        this.node.on(Input.EventType.TOUCH_CANCEL,this.onTouchEnd,this);

        game_play.instance.display_change_event.on(game_play.DisplayChangeEventType.Position,reposition,this);
        game_play.instance.display_change_event.on(game_play.DisplayChangeEventType.Scale,rescale,this);
    }
    onDestroy(): void {
        this.node.off(Input.EventType.TOUCH_START,this.onTouch,this);
        this.node.off(Input.EventType.TOUCH_END,this.onTouchEnd,this);
        this.node.off(Input.EventType.TOUCH_CANCEL,this.onTouchEnd,this);
        game_play.instance.display_change_event.off(game_play.DisplayChangeEventType.Position,reposition,this);
        game_play.instance.display_change_event.off(game_play.DisplayChangeEventType.Scale,rescale,this);
    }
    clean():void{
        for(let node of this.map.values()){
            node.destroy();
        }
        this.map.clear();
    }
    loadMap(t:level_data):void{
        for(let i=0;i<t.size.w;i++)
            for(let j=0;j<t.size.h;j++){
                let node=instantiate(this.prefab);
                this.map.set(new Vec2(i,j),node);
                let Tile=node.getComponent(tile);
                Tile.type=t.tiles[i][j].type;
                node.position=new Vec3(i*global.instance.config.tile_size.w,j*global.instance.config.tile_size.h,0);
                Tile.pos=new Vec2(i,j);
                node.parent=this.node;
            }
        for(let p of t.placements){
            this.map.get(new Vec2(p.pos.x,p.pos.y)).getComponent(tile).state=TileState.Placed;
        }
        // 屏幕占比 宽3/4 高9/13 居中
        // let rate_w=3/4,rate_h=9/13;
        let rate_w=13/15,rate_h=7/9;
        let w=global.instance.config.tile_size.w*t.size.w,h=global.instance.config.tile_size.h*t.size.h;
        let total_size=view.getVisibleSize();
        let mayw=total_size.height*rate_h/h*w,mayh=total_size.width*rate_w/w*h;
        let scale=1;
        if(mayw>total_size.width*rate_w){
            scale=total_size.width*rate_w/w;
            w=total_size.width*rate_w;
            h=mayh;
        }else{
            scale=total_size.height*rate_h/h;
            w=mayw;
            h=total_size.height*rate_h;
        }
        // this.node.parent.position=new Vec3(-w/2+scale/2,-h/2+scale/2,0);
        // this.node.parent.scale=new Vec3(scale,scale,1);
        let Eposition=new Vec3(-w/2+scale/2,-h/2+scale/2,0);
        let Escale=new Vec3(scale,scale,1);
        game_play.instance.display_change_event.emit(game_play.DisplayChangeEventType.Position,Eposition);
        game_play.instance.display_change_event.emit(game_play.DisplayChangeEventType.Scale,Escale);
    }





    start() {
        this.loadMap(game_play.instance.level)
    }

    update(deltaTime: number) {
        
    }

    convertCoordFromTouchPosition(pos:Vec2):Vec2{
        let relateCoord=this.node.getComponent(UITransform).convertToNodeSpaceAR(pos.toVec3()).toVec2();
        relateCoord.x=Math.round(relateCoord.x);relateCoord.y=Math.round(relateCoord.y);
        return relateCoord;
    }

    onTouch(e){
        console.log(`M T ${this.convertCoordFromTouchPosition(e.getUILocation())}`);
    }
    onTouchEnd(e:EventTouch){
        let p=this.convertCoordFromTouchPosition(e.getUILocation());
        if(p.x>=0&&p.y>=0&&p.x<game_play.instance.level.size.w&&p.y<game_play.instance.level.size.h){
            console.log(`EndAt ${this.convertCoordFromTouchPosition(e.getUILocation())}`);
            if(card_manager.instance.prefab){
                let prefab=card_manager.instance.prefab;
                card_manager.instance.prefab=null;
                let t=instantiate(prefab);
                t.getComponent(tower_component).setPos(p);
                placement_manager.instance.node.addChild(t);
            }
        }
        
    }

    static get instance(){return find('Canvas/PlayGround/TileManager').getComponent(tile_manager);}
}


