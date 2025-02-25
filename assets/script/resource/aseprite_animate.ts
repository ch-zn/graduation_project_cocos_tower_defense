import { _decorator, animation,Animation, AnimationClip, AnimationComponent, AnimationState, CCString, Component, ImageAsset, JsonAsset, Node, Rect, Sprite, SpriteFrame ,Texture2D,Vec2} from 'cc';
const { ccclass, property,requireComponent } = _decorator;

@ccclass("AsepriteAnimateData")
export class AsepriteAnimateData{
    @property(CCString)
    name:string;
    @property(Texture2D)
    image:Texture2D;
    @property(JsonAsset)
    json:JsonAsset;
}

@ccclass('aseprite_animate')
@requireComponent(Animation)
export class aseprite_animate extends Component {
    @property(CCString)
    public defaultAnimate:string="default";
    @property({type:[AsepriteAnimateData]})
    public animate:AsepriteAnimateData[]=[];
    static loadedAnim:Map<string,Map<string,AnimationClip>>=new Map();

    private static loadAnim(json:aseprite_json,image:Texture2D,name:string,loaded:Map<string,AnimationClip>):AnimationClip{
        if(!loaded.has(name)){
            const clip=new AnimationClip();
            clip.name=name;
            clip.wrapMode=AnimationClip.WrapMode.Loop;
    
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
            loaded.set(name,clip);
        }
        return loaded.get(name);
    }

    onLoad(): void {
        let defaultValid=false||this.defaultAnimate==="";
        if(!aseprite_animate.loadedAnim.has(this.node.name))
            aseprite_animate.loadedAnim.set(this.node.name,new Map());
        let loaded=aseprite_animate.loadedAnim.get(this.node.name);
        for(let data of this.animate){
            const clip=aseprite_animate.loadAnim(data.json.json as aseprite_json,data.image,data.name,loaded);
            // const json:object=data.json.json;
            // const clip=new AnimationClip();
            // clip.name=data.name;
            // clip.wrapMode=AnimationClip.WrapMode.Loop;
    
            // const frame_track=new animation.ObjectTrack();
            // frame_track.path=new animation.TrackPath().toComponent(Sprite).toProperty("spriteFrame");
            // const frame_arr=[];
            
            // let time=0;
            // for(let frame of json["frames"]){
            //     let sprite_frame=new SpriteFrame();
            //     sprite_frame.texture=data.image;
            //     sprite_frame.offset=new Vec2(frame["spriteSourceSize"]["x"],frame["spriteSourceSize"]["y"]);
            //     sprite_frame.rect=new Rect(frame["frame"]["x"],frame["frame"]["y"],frame["frame"]["w"],frame["frame"]["h"]);
    
            //     frame_arr.push([time,sprite_frame]);
            //     time+=frame["duration"]/1000;
            // }
            // // this.node.getComponent(Sprite).spriteFrame=frame_arr[0][1];
            // clip.duration=time;
            // frame_track.channel.curve.assignSorted(frame_arr);
            // clip.addTrack(frame_track);
            this.node.getComponent(Animation).addClip(clip);
            if(data.name===this.defaultAnimate){
                const comp=this.node.getComponent(Animation);
                comp.defaultClip=clip;
                defaultValid=true;
            }
        }
        if(!defaultValid)console.error(`默认动画${this.defaultAnimate}不存在`);
    }
    start(): void {
        const comp=this.node.getComponent(Animation);
        if(this.defaultAnimate!=="")comp.play(this.defaultAnimate);
    }
}


