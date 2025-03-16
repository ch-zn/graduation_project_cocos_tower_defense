import { _decorator, Component, Node } from 'cc';
import { enemy_component } from '../../../enemy/enemy_component';
const { ccclass, property } = _decorator;

@ccclass('bullet_component')
export abstract class bullet_component extends Component {

    abstract attack_to(e:enemy_component);

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
bullet_component["_sealed"] = false