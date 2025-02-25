import { _decorator, Component, Node } from 'cc';
import { TileMap } from './tile_manager';
import { placement_manager } from './placement_manager';
import { enemy_manager } from './enemy_manager';
import { ResourceInfo } from '../resource/loader';
import { level_info } from './level_info';
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

    resourcelist:ResourceInfo={};
    resource:any={unload:true};
    config={tile_size:{w:32,h:32},defaultMapSize:{w:8,h:8}};
    nextLevel:level_info;
    nextMap:TileMap={size:{w:4,h:4},ground:[["grass","grass","grass","grass",],["grass","dirt","grass","grass",],["grass","grass","grass","grass",],["grass","grass","grass","grass",]],item:[[null,null,null,null],[null,"null",null,null],[null,null,null,null],[null,null,null,null]]};
    
    private constructor(){
        this.nextMap={size:this.config.defaultMapSize,ground:[],item:[]};
        let cnt=0;
        for(let i=0;i<this.config.defaultMapSize.w;i++){
            this.nextMap.ground[i]=[];
            this.nextMap.item[i]=[];
            for(let j=0;j<this.config.defaultMapSize.h;j++){
                this.nextMap.ground[i][j]="O";
                cnt++;
                if(function(c):boolean{for(let i=2;i*i<=c;i++)if(c%i==0)return false;return true;}(cnt))
                    this.nextMap.ground[i][j]="X";
            }
        }
    }
}

