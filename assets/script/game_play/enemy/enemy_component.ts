import { _decorator, Component, find, Node } from 'cc';
import { level_info_path, point } from '../level_info';
import { game_play } from '../game_play';
const { ccclass, property } = _decorator;

@ccclass('enemy_component')
export class enemy_component extends Component {

    path_id:number;         //所处路径
    path_current:number;    //当前在路上第几段
    path_current_rate:number;//0~1 表示当前位置在段上从起点到终点的百分比
    get path():level_info_path{
        return find("Canvas/PlayGround").getComponent(game_play).level.paths[this.path_id];
    }
    get path_left():number{
        return this.path.direction.length-this.path_current-this.path_current_rate;
    }
    pos:point;

    start() {

    }

    update(deltaTime: number) {
        
    }
}


