import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

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


