import { _decorator, Component, Node } from 'cc';
import { TileMap } from './tile_manager';
const { ccclass, property } = _decorator;

@ccclass('global')
export class global{
    public static _instance:global=null;
    public static get instance() : global{
        if(global._instance==null){
            global._instance=new global();
        }
        return global._instance;
    }

    config={tile_size:{w:16,h:16},defaultMapSize:{w:16,h:1}};
    nextMap:TileMap={size:{w:4,h:4},ground:[["grass","grass","grass","grass",],["grass","dirt","grass","grass",],["grass","grass","grass","grass",],["grass","grass","grass","grass",]],item:[[null,null,null,null],[null,"null",null,null],[null,null,null,null],[null,null,null,null]]};

    private constructor(){
        this.nextMap={size:this.config.defaultMapSize,ground:[],item:[]};
        let cnt=0;
        for(let i=0;i<this.config.defaultMapSize.w;i++){
            this.nextMap.ground[i]=[];
            this.nextMap.item[i]=[];
            for(let j=0;j<this.config.defaultMapSize.h;j++){
                this.nextMap.ground[i][j]="grass";
                cnt++;
                if(function(c):boolean{for(let i=2;i*i<=c;i++)if(c%i==0)return false;return true;}(cnt))
                    this.nextMap.ground[i][j]="dirt";
            }
        }
    }
}

