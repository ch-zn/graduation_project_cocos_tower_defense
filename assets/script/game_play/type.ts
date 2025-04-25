import { _decorator, CCFloat, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('gp_position')
export class position{
    @property(CCFloat)
    x: number;
    @property(CCFloat)
    y: number;

}
export type coord = position;
@ccclass('gp_size')
export class size {
    @property(CCFloat)
    w: number;
    @property(CCFloat)
    h: number;
}

@ccclass('gp_rect')
export class rect {
    @property(position)
    pos: position;
    @property(size)
    size: size;
}



