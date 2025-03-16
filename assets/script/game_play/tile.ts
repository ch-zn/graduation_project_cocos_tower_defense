import { _decorator, Component, Node,Animation, CCString, Sprite, UIOpacity, input, Input, EventTouch, UITransform, Vec3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;
import { global } from './global';
import { tile_manager } from './tile_manager';
import { aseprite_bundle } from '../resource/aseprite_bundle';

export enum TileState{
    Normal,     //正常状态
    Disabled,   //不可用
    Prepareing, //准备放置,显示光标
    Placed,     //已放置

}

@ccclass('tile')
export class tile extends Component {
    placeable:boolean;
    @property(CCString)
    type:string;
    _state:TileState=TileState.Normal;
    pos:Vec2;
    onLoad(): void {
        this.node.getChildByName("mark").getComponent(UIOpacity).opacity=0;
        this.node.on(Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.on(Input.EventType.TOUCH_END,this.onTouchEnd,this);
        this.node.on(Input.EventType.TOUCH_CANCEL,this.onTouchCancel,this);
    }

    onDestroy(): void {
        // this.node.off(Input.EventType.TOUCH_START,this.onTouchStart,this);
        // this.node.off(Input.EventType.TOUCH_END,this.onTouchEnd,this);
        // this.node.off(Input.EventType.TOUCH_CANCEL,this.onTouchCancel,this);
    }

    start() {
        this.node.getChildByName("image").getComponent(aseprite_bundle).setFrame(this.type);
    }

    update(deltaTime: number) {
        
    }

    get state():TileState{
        return this._state;
    }
    set state(s:TileState){
        this._state=s;
        switch(s){
            case TileState.Normal:{
                this.node.getChildByName("mark").getComponent(UIOpacity).opacity=0;
                break;
            }
            case TileState.Disabled:{
                this.node.getChildByName("mark").getComponent(UIOpacity).opacity=0;
                break;
            }
            case TileState.Placed:{
                this.node.getChildByName("mark").getComponent(UIOpacity).opacity=0;
                break;
            }
            case TileState.Prepareing:{
                this.node.getChildByName("mark").getComponent(UIOpacity).opacity=255;
                break;
            }

        }
    }

    convertCoordFromUILocation(pos:Vec2):Vec2{
        return this.node.getComponent(UITransform).convertToNodeSpaceAR(pos.toVec3()).toVec2();
    }

    get manager():tile_manager | null{
        return this.node.parent.getComponent(tile_manager);
    }
    offset(o:Vec2):tile | null{
        return this.manager?.map?.get(this.pos.add(o))?.getComponent(tile);
    }

    onTouchStart(e:EventTouch){
        // e.propagationStopped=true;
        console.warn("w");
        console.log(`T T ${this.pos}`);
    }

    onTouchEnd(e:EventTouch){
        // e.propagationStopped=true;
        
        console.log(`T E ${this.pos} ${this.convertCoordFromUILocation(e.getUILocation())}`);
    }

    onTouchCancel(e:EventTouch){
        // e.propagationStopped=true;
        console.log(`T C ${this.pos}`);
    }
}


