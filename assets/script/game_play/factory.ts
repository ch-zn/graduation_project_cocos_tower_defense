import { _decorator, CCClass, CCString, Component, find, Node, Prefab, Script, TypeScript } from 'cc';
const { ccclass, property } = _decorator;
@ccclass("factory_item")
class factory_item{
    @property(CCString)
    name:string;
    @property(Prefab)
    item:Prefab;
}
@ccclass("factory_item_buff")
class factory_item_buff{
    @property(CCString)
    name:string;
    @property(CCString)
    ccClassName:string;
}
@ccclass('factory')
export class factory extends Component {
    @property([factory_item])
    enemys:factory_item[]=[];
    @property([factory_item])
    placements:factory_item[]=[];
    @property([factory_item])
    towers:factory_item[]=[];

    _enemys:{[index:string]:Prefab}={};
    _placements:{[index:string]:Prefab}={};
    _towers:{[index:string]:Prefab}={};
    _loaded=false;

    load(){
        if(this._loaded)return;
        this.enemys.forEach((v)=>this._enemys[v.name]=v.item);
        this.placements.forEach((v)=>this._placements[v.name]=v.item);
        this.towers.forEach((v)=>this._towers[v.name]=v.item);
        this._loaded=true;
    }
    protected onLoad(): void {
        this.load();
    }

    enemy(name:string){return this._enemys[name];}
    placement(name:string){return this._placements[name];}
    tower(name:string){return this._towers[name];}

    static get instance(){return find('Factory').getComponent(factory);}

    start() {

    }

    update(deltaTime: number) {
        
    }
}


