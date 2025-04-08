import { _decorator, Component, find, Node,EventTarget } from 'cc';
import { level_data, LevelUtil } from './level_info';
import { AbstractConstructor } from '../lib/mixins';
const { ccclass, property } = _decorator;

@ccclass('game_play')
export class game_play extends Component {
    level:level_data=test_level_data;
    display_change_event=new EventTarget();
    static DisplayChangeEventType={Scale:"scale",Position:"pos"};
    _pause:boolean;
    pause_event=new EventTarget();
    static PauseEventType={Pause:"pause",Resume:"resume"};
    get pause(){return this._pause;}
    set pause(p:boolean){
        if(p!=this._pause){
            this._pause=p;
            if(p)this.pause_event.emit(game_play.PauseEventType.Pause);
            else this.pause_event.emit(game_play.PauseEventType.Resume);
        }
    }
    switch_pause(){
        this.pause=!this.pause;
    }

    money:{build:number,charge:number}={build:0,charge:0};


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
            enemy_waves:[{enemys:[...[..."^^...++"].map((v)=>{return {type:v,buff:{name:"half_life",time:0,level:0.5}}})],delay:4,wave_delay:8}
        ,{enemys:[...[..."++^++^"].map((v)=>{return {type:v}})],delay:4,wave_delay:8}
        ,{enemys:[...[..."^^++."].map((v)=>{return {type:v}})],delay:4,wave_delay:8}
        ,{enemys:[...[..."....++"].map((v)=>{return {type:v,buff:{name:"half_life",time:0,level:1.5}}})],delay:4,wave_delay:8}
        ,{enemys:[...[..."^^^+++"].map((v)=>{return {type:v,buff:{name:"half_life",time:0,level:2}}})],delay:4,wave_delay:8}
        ,{enemys:[...[..."^^++"].map((v)=>{return {type:v,buff:{name:"half_life",time:0,level:3}}})],delay:4,wave_delay:8}
        ,{enemys:[...[..."^^^+++++"].map((v)=>{return {type:v,buff:{name:"half_life",time:0,level:4}}})],delay:4,wave_delay:8}
        ,{enemys:[...[..."^^++++^^"].map((v)=>{return {type:v,buff:{name:"half_life",time:0,level:5}}})],delay:4,wave_delay:8}
        ]
        }
    }
};
LevelUtil.level_data.fill_tile_by_path(test_level_data);


export function pause_mixin<T extends AbstractConstructor<any>>(Base:T) {
    abstract class aclass extends Base {
    _paused:boolean;
    onLoad(): void {
        super.onLoad();
        this._paused=game_play.instance.pause;
        game_play.instance.pause_event.on(game_play.PauseEventType.Pause,this._on_game_pause,this);
        game_play.instance.pause_event.on(game_play.PauseEventType.Resume,this._on_game_resume,this);
    }
    onDestroy(): void {
        game_play.instance.pause_event.off(game_play.PauseEventType.Pause,this._on_game_pause,this);
        game_play.instance.pause_event.off(game_play.PauseEventType.Resume,this._on_game_resume,this);
    }
    _on_game_pause(){
        this._paused=true;
    }
    _on_game_resume(){
        this._paused=false;
    }
    update(deltaTime: number) {
        if(!this._paused)super.update(deltaTime);
    }
}
return aclass;
}