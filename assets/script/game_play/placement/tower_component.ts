import { _decorator, Component, Node } from 'cc';
import { point } from '../level_info';
const { ccclass, property } = _decorator;


@ccclass('tower_component')
export class tower_component extends Component {
    
    inAttackRange:(pos:point)=>boolean;

    start() {

    }

    update(deltaTime: number) {
        
    }
}


