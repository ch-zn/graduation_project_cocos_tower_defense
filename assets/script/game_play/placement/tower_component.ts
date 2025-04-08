import { _decorator, CCFloat, CCInteger, CCString, Component, Node, Vec3 } from 'cc';
import { point } from '../level_info';
import { enemy_component } from '../enemy/enemy_component';
import { position, rect, size } from '../type';
import { enemy_manager } from '../enemy_manager';
import { bullet_generator_component } from './tower/bullet/bullet_generator_component';
import { game_play, pause_mixin } from '../game_play';
import { placement_manager } from '../placement_manager';
const { ccclass, property } = _decorator;



abstract class _tower_component extends Component {
    pos:position;
    abstract inAttackRange(e:enemy_component):boolean;

    abstract attack(deltaTime:number):void;

    start() {
    }

    update(deltaTime: number) {
        this.attack(deltaTime);
    }

    setPos(p:position){
        this.pos={x:p.x,y:p.y};
        this.node.position=new Vec3(p.x,p.y,0);
    }
}

@ccclass('tower_component')
export abstract class tower_component extends pause_mixin(_tower_component){

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
        if(!this.target?.isValid||!this.inAttackRange(this.target)){
            this.target=enemy_manager.instance.findFirst(this.inAttackRange.bind(this));
        }
        if(this.target?.isValid){
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
            this.getComponent(bullet_generator_component).attack_to(this.target);
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
                this.getComponent(bullet_generator_component).attack_to(target);
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
            this.getComponent(bullet_generator_component).attack_to(target);
        }
    }
}
return aclass;
}

export function tower_attack_chargeable_mixin<T extends Constructor<tower_component>>(Base:T){
    abstract class aclass extends Base{
    @property(CCFloat)
    charge_cost:number;
    abstract onCharge(energe:number):number;

    _charge_enabled:boolean=false;
    get charge_enabled(){return this._charge_enabled;}
    set charge_enabled(c:boolean){
        if(c!=this._charge_enabled){
            this._charge_enabled=c;
            if(c){
                placement_manager.instance.charge_consumer.add(this);
            }else{
                placement_manager.instance.charge_consumer.delete(this);
            }
        }
    }
}
return aclass;
}

export function tower_attack_charge_generator_mixin<T extends Constructor<tower_component>>(Base:T){
    abstract class aclass extends Base{
    @property(CCFloat)
    charge_generate:number;
    abstract onCharge(energe:number):number;

    _charge_enabled:boolean=false;
    get charge_enabled(){return this._charge_enabled;}
    set charge_enabled(c:boolean){
        if(c!=this._charge_enabled){
            this._charge_enabled=c;
            if(c){
                placement_manager.instance.charge_generator.add(this);
            }else{
                placement_manager.instance.charge_generator.delete(this);
            }
        }
    }
}
return aclass;
}