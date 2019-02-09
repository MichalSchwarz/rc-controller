// @flow
export default class State {
    left_horizontal : number;
    left_vertical: number;
    right_horizontal : number;
    right_vertical : number;
    switch_arming: number;

    constructor() {
        this.left_horizontal = 500;
        this.left_vertical = 0;
        this.right_horizontal = 500;
        this.right_vertical = 500;
        this.switch_arming = 0;
    }
}
