import { _decorator, animation, AnimationClip, AnimationComponent, CCString, Component, JsonAsset, Node, Rect, Sprite, SpriteFrame, Texture2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass("AsepriteBundleData")
export class AsepriteBundleData{
    @property(Texture2D)
    image:Texture2D;
    @property(JsonAsset)
    json:JsonAsset;
}

type loaded_data_t={
    [prop: string]:{type:"frame",value:SpriteFrame}|{type:"animate",value:AnimationClip}|{type:"animateClipList",value:AnimationClip[]};
    " animateClips ":{type:"animateClipList",value:AnimationClip[]}
};


@ccclass('aseprite_bundle')
export class aseprite_bundle extends Component {
    @property({type:AsepriteBundleData})
    public bundle:AsepriteBundleData=new AsepriteBundleData();
    @property(CCString)
    public default:string="";
    
    static loadedFrame:Map<Texture2D,loaded_data_t>=new Map();
    frames:loaded_data_t;

    onLoad(): void {
        this.frames=aseprite_bundle.load(this.bundle.image,this.bundle.json.json as aseprite_json);
        if(this.getComponent(AnimationComponent)){
            this.getComponent(AnimationComponent).clips=this.frames[" animateClips "].value;
        }
    }
    start() {
        if(this.default!="")this.setFrame(this.default);
    }

    update(deltaTime: number) {
        
    }

    public setFrame(name:string):void{
        let data=this.frames[name];
        // console.log(name,data.type)
        if(data.type==="frame"){
            this.node.getComponent(Sprite).spriteFrame=data.value;
            // console.log(name,data.type);
        }
        else this.node.getComponent(AnimationComponent).play(name);
    }



    static load(image:Texture2D,json:aseprite_json):loaded_data_t{
        if(aseprite_bundle.loadedFrame.has(image))return aseprite_bundle.loadedFrame.get(image);
        let map={" animateClips ":{type:"animateClipList" as const,value:[]}};
        for(let tagInfo of json.meta.frameTags){
            if(tagInfo.from===tagInfo.to){
                let frame=new SpriteFrame();
                frame.texture=image;
                frame.offset=new Vec2(json.frames[tagInfo.from].spriteSourceSize.x,json.frames[tagInfo.from].spriteSourceSize.y);
                frame.rect=new Rect(json.frames[tagInfo.from].frame.x,json.frames[tagInfo.from].frame.y,json.frames[tagInfo.from].frame.w,json.frames[tagInfo.from].frame.h);
                map[tagInfo.name]={type:"frame",value:frame};
            }else{
                const clip=new AnimationClip();
                clip.name=tagInfo.name;
                switch(tagInfo.direction){
                    case "forward":{
                        if(tagInfo.repeat){
                            clip.wrapMode=AnimationClip.WrapMode.Normal;
                        }else clip.wrapMode=AnimationClip.WrapMode.Loop;
                        break;
                    }
                    case "pingpong":{
                        clip.wrapMode=AnimationClip.WrapMode.PingPong;
                        break;
                    }
                    case "pingpong_reverse":{
                        clip.wrapMode=AnimationClip.WrapMode.PingPongReverse;
                        break;
                    }
                    case "reverse":{
                        if(tagInfo.repeat){
                            clip.wrapMode=AnimationClip.WrapMode.Reverse;
                        }else clip.wrapMode=AnimationClip.WrapMode.LoopReverse;
                        break;
                    }
                }
                const frame_track=new animation.ObjectTrack();
                frame_track.path=new animation.TrackPath().toComponent(Sprite).toProperty("spriteFrame");
                const frame_arr=[];
                            
                let time=0;
                for(let i=tagInfo.from;i<=tagInfo.to;i++){
                    let frame=new SpriteFrame();
                    frame.texture=image;
                    frame.offset=new Vec2(json.frames[i].spriteSourceSize.x,json.frames[i].spriteSourceSize.y);
                    frame.rect=new Rect(json.frames[i].frame.x,json.frames[i].frame.y,json.frames[i].frame.w,json.frames[i].frame.h);
                    
                    frame_arr.push([time,frame]);
                    time+=json.frames[i].duration/1000;
                }
                clip.duration=time;
                frame_track.channel.curve.assignSorted(frame_arr);
                clip.addTrack(frame_track);
                map[tagInfo.name]={type:"animate",value:clip};
                map[" animateClips "].value.push(clip);
            }
        }
        aseprite_bundle.loadedFrame.set(image,map);
        return map;
    }
}


