import { _decorator, CCFloat, Component, find, Node, ProgressBar, sp, Vec3 } from 'cc';
import { level_path, level_path_position, LevelUtil, point } from '../level_info';
import { game_play, pause_mixin } from '../game_play';
import { position } from '../type';
import { enemy_manager } from '../enemy_manager';
import { tower_component } from '../placement/tower_component';
import { Constructor } from '../../lib/mixins';
import { named_enemy_buff } from './named_enemy_buff';
import { enemy_buff } from './enemy_buff';
const { ccclass, property } = _decorator;


class _enemy_component extends Component {

    path_id:number=0;         //所处路径
    walked_distance:number=0; //已经走了的距离
    path_position:level_path_position={
        segment: 0,
        seg_percent: 0,
        end: false
    };    //当前在路径上的位置
    get path():level_path{
        return find("Canvas/PlayGround").getComponent(game_play).level.paths[this.path_id];
    }
    get path_left():number{
        return LevelUtil.path.length(this.path)-this.walked_distance;
    }
    get pos():position{
        return LevelUtil.path.position(this.path,this.path_position);
    }

    buff:enemy_buff[]=[];
    addBuff(b:enemy_buff){
        for(let i=0;i<this.buff.length;i++){
            if(this.buff[i].buff_name===b.buff_name){
                let oldb=this.buff[i];
                if(oldb.level>b.level)return;
                if(oldb.level==b.level){
                    if(oldb.time_left<b.time_left)oldb.time_left=b.time_left;
                    return;
                }
                oldb.end();
                this.buff[i]=b;
                b._buff_apply(this as any as enemy_component);
                return;
            }
        }
        this.buff.push(b);
        b._buff_apply(this as any as enemy_component);
    }
    addBuffByName(name:string,time:number,level:number){this.addBuff(named_enemy_buff.byName(name,time,level));}
    haveBuff(b:string|typeof enemy_buff){
        if(typeof(b)=="string"){
            for(let bf of this.buff)
                if(bf.buff_name==b)return true;
            return false;
        }else return this.haveBuff(b.buff_name);
    }

    tag={last_attack:new Map<any,number>()};

    @property(CCFloat)
    speed:number; // length/s
    move(deltaTime:number){
        this.path_position=LevelUtil.path.walk(this.path,this.path_position,this.speed*deltaTime);
        let p=LevelUtil.path.position(this.path,this.path_position);
        this.node.position=new Vec3(p.x,p.y,0);
        this.walked_distance+=this.speed*deltaTime;
    }

    @property(CCFloat)
    maxHP:number;
    @property(CCFloat)
    maxDefense:number=0;
    HP:number;
    defense:number;
    _attacked(damage:number){
        if(this.defense>0){
            this.defense-=damage;
            if(this.defense>=0)damage=0;
            else {
                damage=-this.defense;
                this.defense=0;
            }
        }
        this.HP-=damage;
        if(this.HP<=0)this.death();
    }

    onDeath(){}
    onAttack(damages:{type:string,hp:number}[],attacker:tower_component){
        let hp=0;
        for(let d of damages)hp+=d.hp;
        this._attacked(hp);
    }
    attack(damages:{type:string,hp:number}[],attacker:tower_component){this.onAttack(damages,attacker);}
    death(){
        enemy_manager.instance.all_enemys.delete(this as any as enemy_component);
        this.onDeath();
        this.node.destroy();
    }

    onLoad(): void {
        this.HP=this.maxHP;
        this.defense=this.maxDefense;
        if(this.maxDefense==0)this.maxDefense=1;
    }

    start() {
        enemy_manager.instance.all_enemys.add(this as any as enemy_component);
    }

    prebuff(deltaTime:number){}
    postbuff(deltaTime:number){}
    run(deltaTime:number){this.move(deltaTime);}

    get healthBar(){
        return this.node.getChildByName("HealthBar").getComponent(ProgressBar);
    }
    get defenseBar(){
        return this.node.getChildByName("DefenseBar").getComponent(ProgressBar);
    }

    update(deltaTime: number) {
        this.prebuff(deltaTime);
        this.buff=this.buff.filter((x)=>!x.lapse());
        for(let i=0;i<this.buff.length;i++)
            this.buff[i].update(deltaTime);
        this.run(deltaTime);
        for(let i=this.buff.length-1;i>=0;i--)
            this.buff[i].post_update();
        this.postbuff(deltaTime);
        this.healthBar.progress=this.HP/this.maxHP;
        this.defenseBar.progress=this.defense/this.maxDefense;
    }

    onDestroy(){
        for(let b of this.buff){
            b.end();
        }
    }
}

@ccclass('enemy_component')
export class enemy_component extends pause_mixin(_enemy_component){
}