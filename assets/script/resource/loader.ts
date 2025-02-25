import { _decorator, animation, AnimationClip, Component, JsonAsset, Node, Prefab, Rect, resources, Sprite, SpriteFrame, TextAsset, Texture2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

export type ResourceInfoItem={type:"animate";name:string;path:string;jsonPath?:string|null;noloop?:boolean;}    // Animate Clip
                            |{type:"image";path:string;}    // SpriteFrame
                            |{type:"text";path:string;}
                            |{type:"prefab",path:string}
export type ResourceInfo={type?:null,[prop: string]:ResourceInfoItem|ResourceInfo};

export class loader{
    private static _countItem(res:ResourceInfo):number{     //计算加载资源总数
        let count=0;
        for(let v in res){
            let data=res[v];
            if(data.type==null){
                count+=this._countItem(data as ResourceInfo);
            }else count++;
        }
        return count;
    }
    private static _load(res:ResourceInfo,onLoadOne:(err?:any)=>void,place:object){  //递归加载资源
        for(let v in res){
            let data=res[v];
            if(data.type==null){
                place[v]={};
                loader._load(data as ResourceInfo,onLoadOne,place[v]);
            }else loader._loadRes(data as ResourceInfoItem,onLoadOne,[place,v]);
        }
    }
    private static _loadRes(res:ResourceInfoItem,onLoadOne:(err?:any)=>void,pos:[object,string]){    //执行具体加载资源的函数
        switch(res.type){
            case "animate":
                return loader._loadAnimate(res,onLoadOne,pos);
            case "image":
                return loader._loadSpriteFrame(res,onLoadOne,pos);
            case "text":
                return loader._loadText(res,onLoadOne,pos);
            case "prefab":
                return loader._loadPrefab(res,onLoadOne,pos);
        }
    }
    static load(res:ResourceInfo,onLoadStart?:(count:number)=>void,onLoadOne?:(err?:any)=>void):object{
        onLoadStart(loader._countItem(res));
        let ret={};
        loader._load(res,onLoadOne??function(err?:any){if(err)console.log(err)},ret);
        return ret;
    }

    private static _loadAnimate(res:{type:"animate";name:string;path:string;jsonPath?:string|null;noloop?:boolean;},onLoadOne:(err?:any)=>void,pos:[object,string]){
        let count=0;
        let image:Texture2D;
        let error:any=null;
        let json:object;
        console.log("w");

        function try_make_clip(){
            if(count!=2)return;
            if(error){
                onLoadOne(error);
                return;
            }

            const clip=new AnimationClip();
            clip.name=res.name;
            if(!res.noloop)clip.wrapMode=AnimationClip.WrapMode.Loop;
    
            const frame_track=new animation.ObjectTrack();
            frame_track.path=new animation.TrackPath().toComponent(Sprite).toProperty("spriteFrame");
            const frame_arr=[];
        
            let time=0;
            for(let frame of json["frames"]){
                let sprite_frame=new SpriteFrame();
                sprite_frame.texture=image;
                sprite_frame.offset=new Vec2(frame["spriteSourceSize"]["x"],frame["spriteSourceSize"]["y"]);
                sprite_frame.rect=new Rect(frame["frame"]["x"],frame["frame"]["y"],frame["frame"]["w"],frame["frame"]["h"]);
        
                frame_arr.push([time,sprite_frame]);
                time+=frame["duration"]/1000;
            }
            clip.duration=time;
            frame_track.channel.curve.assignSorted(frame_arr);
            clip.addTrack(frame_track);
            pos[0][pos[1]]=clip;
            onLoadOne();
        }
        resources.load(`${res.path}/texture`,Texture2D,function(err:any,tex:Texture2D){
                    if(err)error=err;
                    else image=tex;
                    count++;
                    try_make_clip();
                });
        resources.load(res.jsonPath??res.path,JsonAsset,function(err:any,tex:JsonAsset){
            if(err)error=err;
            else json=tex.json;
            count++;
            try_make_clip();
        });
    }

    private static _loadSpriteFrame(res:{type:"image";path:string;},onLoadOne:(err?:any)=>void,pos:[object,string]){
        resources.load(`${res.path}/spriteFrame`,SpriteFrame,function(err:any,sf:SpriteFrame){
            if(err)onLoadOne(err);
            else{
                pos[0][pos[1]]=sf;
                onLoadOne();
            }
        });
    }

    private static _loadText(res:{type:"text";path:string;},onLoadOne:(err?:any)=>void,pos:[object,string]){
        resources.load(res.path,TextAsset,function(err:any,txt:TextAsset){
            if(err)onLoadOne(err);
            else{
                pos[0][pos[1]]=txt;
                onLoadOne();
            }
        });
    }
    private static _loadPrefab(res:{type:"prefab";path:string;},onLoadOne:(err?:any)=>void,pos:[object,string]){
        resources.load(res.path,Prefab,function(err:any,txt:Prefab){
            if(err)onLoadOne(err);
            else{
                pos[0][pos[1]]=txt;
                onLoadOne();
            }
        });
    }
}
