import { _decorator, CCFloat, CCString, Component, lerp, Node, Vec3 } from 'cc';
import { position } from '../../../type';
import { enemy_component } from '../../../enemy/enemy_component';
import { AbstractConstructor, Constructor } from 'db://assets/script/lib/mixins';
import { tower_component } from '../../tower_component';
import { enemy_manager } from '../../../enemy_manager';
const { ccclass, property } = _decorator;


export enum bullet_state{
    MOVING,
    ATTACKING,
    END,
    DEAD
};

@ccclass('bullet_component')
export abstract class bullet_component extends Component {
    _pos:position;
    target:enemy_component;
    start_pos:position;
    state:bullet_state=bullet_state.MOVING;
    get pos(){return this._pos;}
    set pos(p:position){this._pos=p;this.node.position=new Vec3(p.x,p.y,0);}
    get target_pos():position{
        let p=this.target.pos;
        return {x:p.x-this.start_pos.x,y:p.y-this.start_pos.y};
    }
    init(start_pos:position,target:enemy_component){
        this.start_pos=start_pos;
        this.target=target;
    }
    protected onLoad(): void {
        this.pos={x:0,y:0};
    }
    abstract move(deltaTime:number):void;
    try_attack():void{this.state=bullet_state.MOVING;};
    onAttack(e:enemy_component):void{};
    onEnd(deltaTime:number){this.state=bullet_state.DEAD;}
    start() {}

    update(deltaTime: number) {
        switch(this.state){
            case bullet_state.ATTACKING:{
                this.try_attack();
                break;
            }
            case bullet_state.DEAD:{
                this.destroy();
                break;
            }
            case bullet_state.END:{
                this.onEnd(deltaTime);
                break;
            }
            case bullet_state.MOVING:{
                this.move(deltaTime);
                break;
            }
        }
    }
}


bullet_component["_sealed"] = false

export function bullet_move_in_limit_time_mixin<T extends AbstractConstructor<bullet_component>>(Base:T){
    abstract class aclass extends Base{
        @property(CCFloat)
        limit_time:number;
        current_time:number=0;
        move(deltaTime: number): void {
            this.current_time+=deltaTime;
            if(this.current_time>=this.limit_time)this.current_time=this.limit_time;
            if(!this.target?.isValid){
                this.state=bullet_state.DEAD;
                return;
            }
            this.pos={x:lerp(0,this.target_pos.x,this.current_time/this.limit_time),y:lerp(0,this.target_pos.y,this.current_time/this.limit_time)};
            if(this.current_time==this.limit_time){
                this.state=bullet_state.ATTACKING;
                this.update(0);
                this.state=bullet_state.END;
            }
        }
    }
    return aclass;
}

export function bullet_move_in_const_speed_mixin<T extends AbstractConstructor<bullet_component>>(Base:T){
    abstract class aclass extends Base{
        @property(CCFloat)
        bullet_speed:number;
        @property(CCFloat)
        life_time:number=0;
        _dirction:position;
        init(start_pos: position, target: enemy_component): void {
            super.init(start_pos,target);
            this._dirction=Object.assign({},this.target_pos);
            let _dir_len=Math.hypot(this._dirction.x,this._dirction.y);
            if(_dir_len>0){this._dirction.x/=_dir_len;this._dirction.y/=_dir_len;}
        }
        move(deltaTime: number): void {
            this.life_time-=deltaTime;
            if(this.life_time<=0){this.state=bullet_state.END;}
            this.pos={x:this.pos.x+deltaTime*this.bullet_speed*this._dirction.x,y:this.pos.y+deltaTime*this.bullet_speed*this._dirction.y};
            this.state=bullet_state.ATTACKING;
            this.update(0);
        }
    }
    return aclass;
}

export function bullet_single_attack_mixin<T extends AbstractConstructor<bullet_component>>(Base:T){
    abstract class aclass extends Base{
        @property(CCString)
        attack_type:string="laser";
        @property(CCFloat)
        ATK:number;
        try_attack(): void {
            this.target.attack([{type:this.attack_type,hp:this.ATK}],this.node.parent.parent.getComponent(tower_component));
            this.onAttack(this.target);
            super.try_attack();
        }
    }
    return aclass;
}

export function bullet_multi_attack_mixin<T extends AbstractConstructor<bullet_component>>(Base:T){
    abstract class aclass extends Base{
        @property(CCString)
        attack_type:string="laser";
        @property(CCFloat)
        ATK:number;
        @property(CCFloat)
        attack_radius:number;
        attacked_enemy:Set<enemy_component>=new Set();
        inAttackRange(e:enemy_component){
            return Math.hypot((this.pos.x-e.pos.x),this.pos.y-e.pos.y)<=this.attack_radius && !this.attacked_enemy.has(e);
        }
        try_attack(): void {
            let targets=enemy_manager.instance.findAll(this.inAttackRange.bind(this));
            for(let target of targets){
                target.attack([{type:this.attack_type,hp:this.ATK}],this.node.parent.parent.getComponent(tower_component));
                this.attacked_enemy.add(target);
                this.onAttack(target);
            }
            super.try_attack();
        }
    }
    return aclass;
}