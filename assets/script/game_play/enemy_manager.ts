import { _decorator, CCString, Component, find, Node ,Prefab} from 'cc';
import { enemy_component } from './enemy/enemy_component';
import { tower_component } from './placement/tower_component';
import { position } from './type';
import { Heap } from '../lib/datastructures-js/heap';
import { game_play } from './game_play';
const { ccclass, property } = _decorator;

@ccclass('EnemyData')
export class EnemyData{
    @property(CCString)
    name:string;
    @property(Prefab)
    prefabs:Prefab;
}

@ccclass('enemy_manager')
export class enemy_manager extends Component {
    static get instance(){
        return find("Canvas/PlayGround/EnemyManager").getComponent(enemy_manager);
    }
    @property([EnemyData])
    prefabs:EnemyData[]=[];

    all_enemys:Set<enemy_component>=new Set();

    // findOne(tower:tower_component):enemy_component|null{    //找到范围内最早产生的敌人 复杂度最坏O(n)
    //     for(let e of this.all_enemys){
    //         if(tower.inAttackRange(e.pos))
    //             return e;
    //     }
    //     return null;
    // }

    // findSome(tower:tower_component,count:number):enemy_component[]{ //找到范围内最早产生的若干个敌人 复杂度最坏O(n)
    //     if(count<=0)return [];
    //     let ret=[];
    //     for(let e of this.all_enemys){
    //         if(tower.inAttackRange(e.pos)){
    //             ret.push(e);
    //             count--;
    //             if(count==0)break;
    //         }
    //     }
    //     return ret;
    // }

    findAll(inAttackRange:(p:enemy_component)=>boolean):enemy_component[]{ //找到范围内所有敌人 Θ(n)
        let ret=[];
        for(let e of this.all_enemys){
            if(inAttackRange(e)){
                ret.push(e);
            }
        }
        return ret;
    }

    findFirstSome(inAttackRange:(p:enemy_component)=>boolean,count:number=1):enemy_component[]{   //找到范围内离终点最近的敌人 复杂度Θ(n*log(count))
        if(count<=0)return [];
        let heap=new Heap<enemy_component>((a,b)=>a.path_left>b.path_left?-1:1);
        for(let e of this.all_enemys){
            if(inAttackRange(e)){
                heap.push(e);
                if(heap.size()>count)heap.pop();
            }
        }
        return heap.sort();
    }

    findFirst(inAttackRange:(p:enemy_component)=>boolean):enemy_component|null{   //找到范围内离终点最近的敌人 复杂度Θ(n*log(count))
        let ret=null,dis=Number.POSITIVE_INFINITY;
        for(let e of this.all_enemys){
            if(inAttackRange(e)&&e.path_left<dis){
                dis=e.path_left;
                ret=e;
            }
        }
        return ret;
    }

    findNearest(distance:(p:enemy_component)=>number,inAttackRange:(p:enemy_component)=>boolean=()=>true):enemy_component|null{ //找到范围内最近的敌人 复杂度Θ(n)
        let ret=null;
        let dis=Number.POSITIVE_INFINITY;
        for(let e of this.all_enemys){
            if(inAttackRange(e)){
                let p=distance(e);
                if(p<dis){
                    dis=p;
                    ret=e;
                }
            }
        }
        return ret;
    }


    onLoad(): void {
        game_play.instance.display_change_event.on(game_play.DisplayChangeEventType.Position,function(pos){this.node.position=pos;},this);
        game_play.instance.display_change_event.on(game_play.DisplayChangeEventType.Scale,function(scale){this.node.scale=scale;},this);
    }
    start() {
        
    }

    update(deltaTime: number) {
        
    }
    onDestroy(): void {
        game_play.instance.display_change_event.off(game_play.DisplayChangeEventType.Position,function(pos){this.node.position=pos;},this);
        game_play.instance.display_change_event.off(game_play.DisplayChangeEventType.Scale,function(scale){this.node.scale=scale;},this);
    }
}


