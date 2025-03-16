import { _decorator, Component, find, instantiate, Node, Prefab, warn } from 'cc';
import { game_play } from './game_play';
import { factory } from './factory';
import { enemy_component } from './enemy/enemy_component';
const { ccclass, property } = _decorator;

@ccclass("enemy_generator_component")
export class enemy_generator_component extends Component{
    static get instance(){
        return find("Canvas/PlayGround/EnemyManager").getComponent(enemy_generator_component);
    }
    static get node(){
        return find("Canvas/PlayGround/EnemyManager");
    }
    generator:enemy_generator;
    onLoad(): void {
        let enemy_data=game_play.instance.level.enemys;
        this.generator=enemy_generator.byName(enemy_data.generator,enemy_data.data);
    }
    start() {
        this.generator.start();
    }

    update(deltaTime: number) {
        this.generator.update(deltaTime);
    }
    get finish(){return this.generator.all_enemy_generated;}
}

export abstract class enemy_generator{
    abstract get all_enemy_generated():boolean;
    abstract start():void;
    abstract update(deltaTime: number):void;
    private static _factory:factory;
    protected static get factory(){if(this._factory==null)this._factory=factory.instance;return this._factory;}
    static byName(name:string,data:any):enemy_generator{
        switch(name){
            case "fixed":return new enemy_generator_fixed(data);
            default:
                throw  new Error(`enemy generator '${name}' don't exists`);
        }
    }
}

export type enemy_generator_data={
    type:string;
    path?:number;   //default:0
    buff?:{name:string,time:number,level:number};
    delay?:number;
    multi?:{    //一次生成多个敌人
        type:string;
        buff?:{name:string,time:number,level:number};
        path?:number;
    }[];
};
export type fixed_enemy_generator_data={
    wave:number;
    enemy_waves:{enemys:(enemy_generator_data|"last"|"skip")[],delay:number}[];
};
class enemy_generator_fixed extends enemy_generator{
    data:fixed_enemy_generator_data;
    current_wave:number=0;
    current_enemy:number=0;
    delay:number;
    last_enemy_data:enemy_generator_data;
    constructor(data:fixed_enemy_generator_data){
        super();
        this.data=data;
        this.delay=data.enemy_waves[0].delay;
    }
    get all_enemy_generated(): boolean {
        return this.current_wave>=this.data.wave;
    }
    start(): void {}
    update(deltaTime: number): void {
        if(this.all_enemy_generated)return;
        this.delay-=deltaTime;
        
        console.log(`delay ${this.delay}`);
        if(this.delay<=0){
            this.delay+=this.generate();
        }
    }
    generate(){
        let cur=this.data.enemy_waves[this.current_wave].enemys[this.current_enemy];
        let enemy_data:enemy_generator_data;
        if(typeof(cur)=="string"){
            if(cur=="skip")return this.data.enemy_waves[this.current_wave].delay;
            if(cur=="last"&&this.last_enemy_data){
                enemy_data=this.last_enemy_data;
            }
        }else{
            enemy_data=cur;
            this.last_enemy_data=cur;
        }
        this.generateEnemy(enemy_data);
        this.current_enemy++;
        if(this.current_enemy==this.data.enemy_waves[this.current_wave].enemys.length){
            this.current_enemy=0;
            this.current_wave++;
        }
        return enemy_data.delay??this.data.enemy_waves[this.current_wave].delay;
    }
    generateEnemy(enemy_data:enemy_generator_data){
        let e=enemy_generator.factory.enemy(enemy_data.type);
        console.log(e);
        let enemy=instantiate(enemy_generator.factory.enemy(enemy_data.type));
        let component=enemy.getComponent(enemy_component);
        component.path_id=enemy_data.path??0;
        if(enemy_data.buff)component.addBuffByName(enemy_data.buff.name,enemy_data.buff.time,enemy_data.buff.level);
        component.move(0);
        enemy_generator_component.node.addChild(enemy);
        if(enemy_data.multi){
            for(let e of enemy_data.multi){
                this.generateEnemy(e);
            }
        }
    }
    
}
