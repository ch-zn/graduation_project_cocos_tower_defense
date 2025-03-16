import { _decorator, Component, lerp, math, Node } from 'cc';
import { coord, position, size } from './type';
const { ccclass, property } = _decorator;

export type level_path_direction="L"|"R"|"U"|"D"|{act:"end"}|{act:"move",to:coord,from:coord}|{act:"tp",to:coord,from:coord}
export type level_path={
    start:coord;
    path:level_path_direction[];
}
export type level_path_position={
    segment:number; //当前第几段
    seg_percent:number;//当前段走了多少
    end:boolean;//是否走完
}
export type level_tile_type=
     "L" // ←
    |"R" // →
    |"U" // ↑
    |"D" // ↓
    |"C" // .
    |"O" //  
    |"LR"// ↔
    |"UD"// ↕
    |"RD"// ┏
    |"LD"// ┓
    |"UR"// ┗
    |"UL"// ┛
    |"UX"// ┳
    |"LX"// ┣
    |"RX"// ┫
    |"DX"// ┻
    |"X" // ╋
;
export type level_tile_data={
    type:level_tile_type;
    theme?:string;
}
export type level_data={
    size:size;
    theme:string;
    tiles:level_tile_data[][];
    paths:level_path[];
    placements:{pos:coord;type:string}[];
    enemys:{generator:string;data:any}; //see enemy_generator
}
export class LevelUtil{
    static path={
        length:function(path:level_path){
            if((path as any)._path_length)return (path as any)._path_length;
            let len=0;
            for(let p of path.path){
                len+=LevelUtil.path.segment_length(p);
            }
            (path as any)._path_length=len;
            return len;
        },
        segment_length:function(p:level_path_direction){
            if(typeof(p)=="string")return 1;
            else if(p.act=="move")return Math.hypot(p.from.x-p.to.x,p.from.y-p.to.y);
            else return 0;
        },
        walk:function(p:level_path,s:level_path_position,d:number):level_path_position{
            if(s.end)return s;
            let cur_seg_len=LevelUtil.path.segment_length(p.path[s.segment]);
            let left_d=cur_seg_len*(1-s.seg_percent);
            if(d<=left_d&&left_d>0){
                return {segment:s.segment,seg_percent:s.seg_percent+d/cur_seg_len,end:false};
            }else{
                d-=left_d;
                for(let i=s.segment+1;;i++){
                    let path=p.path[i];
                    if(typeof(path)!="string"&&path.act=="end"){
                        return {segment:i,seg_percent:1,end:true};
                    }
                    let pd=LevelUtil.path.segment_length(path);
                    if(d<=pd&&pd>0){
                        return {segment:i,seg_percent:d/pd,end:false};
                    }
                    d-=pd;
                }
            }
        },
        position:function(p:level_path,pos:level_path_position):position{
            if(!(p as any)._path_begin_pos){
                let path_pos:position[]=[];
                let path=p.path;
                for(let i=0,j:position=Object.assign({},p.start);i<p.path.length;i++){
                    path_pos[i]=Object.assign({},j);
                    let dir=path[i];
                    if(typeof(dir)=="string"){
                        switch(dir){
                            case "L":j.x--;break;
                            case "R":j.x++;break;
                            case "U":j.y++;break;
                            case "D":j.y--;break;
                        }
                    }else{
                        if(dir.act=="move"||dir.act=="tp"){
                            Object.assign(j,dir.to);
                        }else break;
                    }
                }
                (p as any)._path_begin_pos=path_pos;
            }
            let path_pos=(p as any)._path_begin_pos;
            if(pos.end)return Object.assign({},path_pos[pos.segment]);
            return {x:lerp(path_pos[pos.segment].x,path_pos[pos.segment+1].x,pos.seg_percent),y:lerp(path_pos[pos.segment].y,path_pos[pos.segment+1].y,pos.seg_percent)};
        }
    }
    static level_data={
        fill_tile_by_path(data:level_data){
            data.tiles=new Array<Array<level_tile_data>>(data.size.w);
            let tile_dir=new Array<Array<{l,r,u,d}>>(data.size.w);
            for(let x=0;x<data.size.w;x++){
                data.tiles[x]=new Array(data.size.h);
                tile_dir[x]=new Array(data.size.h);
                for(let y=0;y<data.size.h;y++){
                    data.tiles[x][y]={type:"O"};
                    tile_dir[x][y]={l:0,r:0,u:0,d:0};
                }
            }
            for(let path of data.paths){
                let p=Object.assign({},path.start);
                for(let d of path.path){
                    if(typeof(d)=="string"){
                        switch(d){
                            case "L":tile_dir[p.x][p.y].l=1;p.x--;tile_dir[p.x][p.y].r=1;break;
                            case "R":tile_dir[p.x][p.y].r=1;p.x++;tile_dir[p.x][p.y].l=1;break;
                            case "U":tile_dir[p.x][p.y].u=1;p.y++;tile_dir[p.x][p.y].d=1;break;
                            case "D":tile_dir[p.x][p.y].d=1;p.y--;tile_dir[p.x][p.y].u=1;break;
                        }
                    }else{
                        if(d.act=="end")break;
                        else p=Object.assign({},d.to);
                    }
                }
            }
            let type:level_tile_type[][][][]=[
                [
                    [
                        [
                            "O","D"
                        ],
                        [
                            "U","UD"
                        ]
                    ],
                    [
                        [
                            "R","RD"
                        ],
                        [
                            "UR","LX"
                        ]
                    ]
                ],
                [
                    [
                        [
                            "L","LD"
                        ],
                        [
                            "UL","RX"
                        ]
                    ],
                    [
                        [
                            "LR","UX"
                        ],
                        [
                            "DX","X"
                        ]
                    ]
                ]
            ];
            for(let x=0;x<data.size.w;x++){
                for(let y=0;y<data.size.h;y++){
                    let t=tile_dir[x][y];
                    data.tiles[x][y].type=type[t.l][t.r][t.u][t.d];
                }
            }
        },
        fix_path_from(data:level_data){
            for(let path of data.paths){
                let p=Object.assign({},path.start);
                for(let d of path.path){
                    if(typeof(d)=="string"){
                        switch(d){
                            case "L":p.x--;break;
                            case "R":p.x++;break;
                            case "U":p.y++;break;
                            case "D":p.y--;break;
                        }
                    }else{
                        if(d.act=="end")break;
                        else {
                            d.from=Object.assign({},p);
                            p=Object.assign({},d.to);
                        }
                    }
                }
            }
        },
    }
}

export type point={x:number,y:number}
export type level_info_path={
    start_pos:point,
    direction:("L"|"R"|"U"|"D"|"End")[];
}
export type level_info={
    size:{w:number,h:number};
    mapTile:string[][];
    placements:string[][];
    paths:level_info_path[];
    enemys:{wave_count:number}&
        ({gen_alg:"fixed",waves:({enemy:{type:string,delay:{time:number,faster?:true/*如果之前的敌人都被消灭则提前刷出*/ }}[],event:any})[]}
        |{gen_alg:"random",waves:{}[]});
}


