import { _decorator, CCString, Component, Node ,Prefab} from 'cc';
import { enemy_component } from './enemy/enemy_component';
import { tower_component } from './placement/tower_component';
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
    @property([EnemyData])
    prefabs:EnemyData[]=[];

    enemys_on_path:Set<enemy_component>[]=[];   //各条路上现存的敌人
    all_enemys:Set<enemy_component>=new Set();

    findOne(tower:tower_component):enemy_component|null{    //找到范围内最早产生的敌人 复杂度最坏O(n)
        for(let e of this.all_enemys){
            if(tower.inAttackRange(e.pos))
                return e;
        }
        return null;
    }

    findSome(tower:tower_component,count:number):enemy_component[]{ //找到范围内最早产生的若干个敌人 复杂度最坏O(n)
        if(count<=0)return [];
        let ret=[];
        for(let e of this.all_enemys){
            if(tower.inAttackRange(e.pos)){
                ret.push(e);
                count--;
                if(count==0)break;
            }
        }
        return ret;
    }

    findAll(tower:tower_component):enemy_component[]{ //找到范围内所有敌人 Θ(n)
        let ret=[];
        for(let e of this.all_enemys){
            if(tower.inAttackRange(e.pos)){
                ret.push(e);
            }
        }
        return ret;
    }

    findFirstSome(tower:tower_component,count:number=1){   //找到范围内离终点最近的敌人 复杂度最坏Θ(n*count)
        if(count<=0)return [];
        let ret=new Array<enemy_component>();
        for(let e of this.all_enemys){
            if(tower.inAttackRange(e.pos)){
                let L=0,R=ret.length-1,pos=0;
                while(L<=R){
                    let mid=Math.floor((L+R)/2);
                    if(e.path_left<ret[mid].path_left){
                        pos=mid;
                        R=mid-1;
                    }else L=mid+1;
                }
                if(pos<count){
                    ret.splice(pos,0,e);
                    if(ret.length>count)ret.pop();
                }
            }
        }
        return ret;
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


