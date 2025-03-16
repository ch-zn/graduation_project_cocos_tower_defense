import { _decorator, Component, find, Node,EventTarget } from 'cc';
import { level_data, LevelUtil } from './level_info';
const { ccclass, property } = _decorator;

@ccclass('game_play')
export class game_play extends Component {
    level:level_data=test_level_data;
    display_change_event=new EventTarget();
    static DisplayChangeEventType={Scale:"scale",Position:"pos"};
    pause:boolean;
    pause_event=new EventTarget();
    static PauseEventType={Pause:"pause",Resume:"resume"};


    
    start() {

    }

    update(deltaTime: number) {
        
    }

    static get instance(){
        return find("Canvas/PlayGround").getComponent(game_play);
    }
}

let test_level_data:level_data={
    size: {w:13,h:7},
    theme: 'forest',
    tiles: [],
    paths: [
        {
            start: {x:3,y:5},
            path: ["L","L","D","D","R","R","R","D","D","R","R","R","U","U","U","R","R","R","R","D","D","R",{act:"end"}]
        }
    ],
    placements: [],
    enemys: {
        generator: 'fixed',
        data: {
            wave:8,
            enemy_waves:[{enemys:[{type:"."},"last","last"],delay:2}
        ,{enemys:[{type:"."},"last","last"],delay:2}
        ,{enemys:[{type:"."},"last","last"],delay:2}
        ,{enemys:[{type:"."},"last","last"],delay:2}
        ,{enemys:[{type:"."},"last","last"],delay:2}
        ,{enemys:[{type:"."},"last","last"],delay:2}
        ,{enemys:[{type:"."},"last","last"],delay:2}
        ,{enemys:[{type:"."},"last","last"],delay:2}
        ]
        }
    }
};
LevelUtil.level_data.fill_tile_by_path(test_level_data);
