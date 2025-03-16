import { _decorator, Component, director, JsonAsset, Node, resources, Scene, Texture2D } from 'cc';
import { global } from '../game_play/global';
import { loader } from './loader';
const { ccclass, property } = _decorator;

@ccclass('test')
export class test extends Component {
    cnt=0;
    start() {
        global.instance.resourcelist={
            tower:{
                attack:{
                    type:"animate",
                    name:"attack",
                    path:"塔/能量球-attack"
                }
            }
        };
        global.instance.resource=loader.load(global.instance.resourcelist,function(num){console.log(`totoal resource:${num}`)},function(err?:any){console.log(`loadedOne ${err}`);this.cnt++;}.bind(this));
    }

    tryChangeScence(){
        // if(this.cnt==3)
        director.addPersistRootNode(this.node);
            director.loadScene("game_play",function(){console.log("callback")});
    }

    update(deltaTime: number) {
        console.log("unpade");
        if(this.cnt==0)return;
        this.tryChangeScence();
        // console.log(global.instance.resource);
        // console.log(`tower: ${global.instance.resource.tower.attack.name}`);
    }
}


