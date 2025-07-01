export class Camera{
    constructor(pos, at, up, fovy, aspect, near, far){
        this.view = mat4();
        this.perspective = mat4();
        this.pos = pos;
        this.at = at;
        this.up = up;
        this.fovy = fovy;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
    }
}