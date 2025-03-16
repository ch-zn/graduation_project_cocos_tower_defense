import { _decorator, CCFloat, CCInteger, CCString, Component, Node } from 'cc';
import { point } from '../level_info';
import { enemy_component } from '../enemy/enemy_component';
import { position, rect, size } from '../type';
import { enemy_manager } from '../enemy_manager';
import { bullet_component } from './tower/bullet/bullet_component';
const { ccclass, property } = _decorator;


@ccclass('tower_component')
export abstract class tower_component extends Component {
    pos:position;
    abstract inAttackRange(e:enemy_component):boolean;

    abstract attack(deltaTime:number):void;

    start() {
    }

    update(deltaTime: number) {
        this.attack(deltaTime);
    }
}

/*
    通过Mixin实现子类时，cocos不知道它有子类
    这时getComponent会根据构造函数判断是否匹配
    手动设置_sealed让它走instance判断
*/
tower_component["_sealed"] = false

type Constructor<T> = (abstract new (...args: any[]) => T);

export function tower_range_round_mixin<T extends Constructor<tower_component>>(Base:T) {
    abstract class aclass extends Base {
    @property(CCFloat)
    attack_radius:number;
    inAttackRange(e:enemy_component){
        return Math.hypot((this.pos.x-e.pos.x),this.pos.y-e.pos.y)<=this.attack_radius;
    }
}
return aclass;
}

export function tower_range_rect_mixin<T extends Constructor<tower_component>>(Base:T){
    abstract class aclass extends Base{
    @property(rect)
    attack_rect:rect;
    inAttackRange(e:enemy_component){
        return e.pos.x>=this.attack_rect.pos.x && e.pos.x<this.attack_rect.pos.x+this.attack_rect.size.w
            && e.pos.y>=this.attack_rect.pos.y && e.pos.y<this.attack_rect.pos.y+this.attack_rect.size.h;
    }
}
return aclass;
}

export function tower_attack_single_laser_mixin<T extends Constructor<tower_component>>(Base:T){
    abstract class aclass extends Base{
    target:enemy_component|null;
    @property(CCFloat)
    ATK:number; //每秒伤害
    @property(CCString)
    attack_type:string="laser";
    attack(t:number){
        if(!this.target?.isValid){
            this.target=enemy_manager.instance.findFirst(this.inAttackRange.bind(this));
        }
        if(this.target!=null){
            this.target.attack([{type:this.attack_type,hp:this.ATK*t}],this);
        }
    }
}
return aclass;
}

export function tower_attack_range_laser_mixin<T extends Constructor<tower_component>>(Base:T){
    abstract class aclass extends Base{
    targets:enemy_component[]=[];
    @property(CCFloat)
    ATK:number; //每秒伤害
    @property(CCString)
    attack_type:string="laser";
    attack(t:number){
        if(true){
            this.targets=enemy_manager.instance.findAll(this.inAttackRange.bind(this));
        }
        for(let target of this.targets){
            target.attack([{type:this.attack_type,hp:this.ATK*t}],this);
        }
    }
}
return aclass;
}

export function tower_attack_multi_laser_mixin<T extends Constructor<tower_component>>(Base:T){
    abstract class aclass extends Base{
    targets:enemy_component[]=[];
    @property(CCFloat)
    ATK:number; //每秒伤害
    @property(CCString)
    attack_type:string="laser";
    @property(CCInteger)
    max_attack_target=1;
    attack(t:number){
        this.targets=this.targets.filter((x)=>x.isValid);
        if(this.targets.length<this.max_attack_target){
            this.targets.push(...enemy_manager.instance.findFirstSome(this.inAttackRange.bind(this),this.max_attack_target-this.targets.length));
        }
        for(let target of this.targets){
            target.attack([{type:this.attack_type,hp:this.ATK*t}],this);
        }
    }
}
return aclass;
}

export function tower_attack_single_bullet_mixin<T extends Constructor<tower_component>>(Base:T){
    abstract class aclass extends Base{
    target:enemy_component|null;
    @property(CCFloat)
    cool_down:number;//冷却时间
    @property(CCFloat)
    start_cool_down:number=0;//起始冷却时间

    current_cool_down:number=this.start_cool_down;
    @property(CCString)
    attack_type:string="laser";
    attack(t:number){
        this.current_cool_down-=t;
        if(!this.target?.isValid){
            this.target=enemy_manager.instance.findFirst(this.inAttackRange.bind(this));
        }
        if(this.target!=null&&this.current_cool_down<=0){
            this.current_cool_down=this.cool_down;
            this.getComponent(bullet_component).attack_to(this.target);
        }
    }
}
return aclass;
}

export function tower_attack_range_bullet_mixin<T extends Constructor<tower_component>>(Base:T){
    abstract class aclass extends Base{
    targets:enemy_component[]=[];
    @property(CCFloat)
    cool_down:number;//冷却时间
    @property(CCFloat)
    start_cool_down:number=0;//起始冷却时间

    current_cool_down:number=this.start_cool_down;
    @property(CCString)
    attack_type:string="laser";
    attack(t:number){
        this.current_cool_down-=t;
        if(this.current_cool_down<=0){
            this.targets=enemy_manager.instance.findAll(this.inAttackRange.bind(this));
        }
        if(this.current_cool_down<=0)
            for(let target of this.targets){
                this.current_cool_down=this.cool_down;
                this.getComponent(bullet_component).attack_to(target);
            }
    }
}
return aclass;
}

export function tower_attack_multi_bullet_mixin<T extends Constructor<tower_component>>(Base:T){
    abstract class aclass extends Base{
    targets:enemy_component[]=[];
    @property(CCFloat)
    cool_down:number;//冷却时间
    @property(CCFloat)
    start_cool_down:number=0;//起始冷却时间

    current_cool_down:number=this.start_cool_down;
    @property(CCString)
    attack_type:string="laser";
    @property(CCInteger)
    max_attack_target=1;
    attack(t:number){
        this.current_cool_down-=t;
        this.targets=this.targets.filter((x)=>x.isValid);
        if(this.current_cool_down>0)return;
        if(this.targets.length<this.max_attack_target){
            this.targets.push(...enemy_manager.instance.findFirstSome(this.inAttackRange.bind(this),this.max_attack_target-this.targets.length));
        }
        for(let target of this.targets){
            this.current_cool_down=this.cool_down;
            this.getComponent(bullet_component).attack_to(target);
        }
    }
}
return aclass;
}