type aseprite_json={
    frames:Array<{
        filename:string;
        frame:{x:number;y:number;w:number;h:number};
        rotated:boolean;
        trimmed:boolean;
        spriteSourceSize: { x: number, y: number, w: number, h: number };
        sourceSize: { w: number, h: number };
        duration: number
    }>;
    meta:{
        app?: "https://www.aseprite.org/" | string,
        version: string,
        image: string,
        format: string,
        size: { w: number, h: number },
        scale: string,
        frameTags:Array<{name: string; from: number, to: number, direction: "pingpong_reverse"|"reverse"|"pingpong"|"forward", color: string ,repeat?:string}>;
        layers: Array<{ name: string, opacity: number, blendMode: string }>;
        slices: []
    }

}