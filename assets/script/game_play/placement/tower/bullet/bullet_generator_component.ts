import { _decorator, CCFloat, CCString, Component, instantiate, Node, Prefab } from 'cc';
import { enemy_component } from '../../../enemy/enemy_component';
import { AbstractConstructor, Constructor } from 'db://assets/script/lib/mixins';
import { bullet_component } from './bullet_component';
import { tower_component } from '../../tower_component';
const { ccclass, property } = _decorator;

@ccclass('bullet_generator_component')
export abstract class bullet_generator_component extends Component {

    abstract attack_to(e:enemy_component);
    bullets:Node;
    onLoad(): void {
        this.bullets=new Node("bullets");
        this.node.addChild(this.bullets);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


/*
    通过Mixin实现子类时，cocos不知道它有子类
    这时getComponent会根据构造函数判断是否匹配
    手动设置_sealed让它走instance判断
*/
bullet_generator_component["_sealed"] = false


export function bullet_generator_single_bullet_mixin<T extends AbstractConstructor<bullet_generator_component>>(Base:T){
    abstract class aclass extends Base{
        @property(Prefab)
        bullet:Prefab;
        attack_to(e:enemy_component){
            let b=instantiate(this.bullet);
            let bullet=b.getComponent(bullet_component);
            bullet.init(this.getComponent(tower_component).pos,e);
            this.bullets.addChild(b);
        }
    }
return aclass;
}