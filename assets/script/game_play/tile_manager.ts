import { _decorator, Canvas, Component, find, Input, instantiate, Node, Prefab, Vec2, Vec3, view } from 'cc';
import { tile, TileState } from './tile';
import { global } from './global';
const { ccclass, property } = _decorator;

export class TileMap{
    size:{w:number,h:number};
    ground:Array<Array<string>>;
    item:Array<Array<string | null>>;
}

@ccclass('tile_manager')
export class tile_manager extends Component {
    map:Map<Vec2,Node>=new Map();
    @property(Prefab)
    prefab:Prefab;
    onLoad(): void {
        this.node.on(Input.EventType.TOUCH_START,function(e){console.log("M T")});
        this.node.on(Input.EventType.TOUCH_END,function(e){console.log("M E")});
    }
    clean():void{
        for(let node of this.map.values()){
            node.destroy();
        }
        this.map.clear();
    }
    loadMap(t:TileMap):void{
        for(let i=0;i<t.size.w;i++)
            for(let j=0;j<t.size.h;j++){
                let node=instantiate(this.prefab);
                this.map.set(new Vec2(i,j),node);
                let Tile=node.getComponent(tile);
                Tile.type=t.ground[i][j];
                if(t.item[i][j]!==null){
                    Tile.state=TileState.Placed;
                }
                node.position=new Vec3(i*global.instance.config.tile_size.w,j*global.instance.config.tile_size.h,0);
                Tile.pos=new Vec2(i,j);
                node.parent=this.node;
            }
        // 宽3/4 高9/13 居中
        let w=global.instance.config.tile_size.w*t.size.w,h=global.instance.config.tile_size.h*t.size.h;
        let total_size=view.getVisibleSize();
        let mayw=total_size.height*9/13/h*w,mayh=total_size.width*3/4/w*h;
        let scale=1;
        if(mayw>total_size.width*3/4){
            scale=total_size.width*3/4/w;
            w=total_size.width*3/4;
            h=mayh;
        }else{
            scale=total_size.height*9/13/h;
            w=mayw;
            h=total_size.height*9/13;
        }
        this.node.parent.position=new Vec3(-w/2,-h/2,0);
        this.node.parent.scale=new Vec3(scale,scale,0);
    }





    start() {
        this.loadMap(global.instance.nextMap);
    }

    update(deltaTime: number) {
        
    }

    
}


