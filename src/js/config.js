// @flow

class Config {
    app_name: string;
    controls_id: string;
    lc_id: string;
    rc_id: string;
    switch_arming_id: string;
    switch_on_value: number;
    switch_off_value: number;
    axis_size: number;
    axis_style: string;
    control_point_style: string;
    control_point_size: number;
    control_range: number;
    control_range_offset: number;
    keepAliveInterval: number;
    scale: number;

    constructor() {
        this.app_name = "RC Controller";
        this.controls_id = "controls";
        this.lc_id = "left-cross";
        this.rc_id = "right-cross";
        this.switch_arming_id = "switch-arming";
        this.switch_on_value = 1000;
        this.switch_off_value = 0;
        this.axis_size = 240;
        this.axis_style = "lightgray";
        this.control_point_style = "black";
        this.control_point_size = 10;
        this.control_range = 130;
        this.control_range_offset = 25;
        this.keepAliveInterval = 500;
        this.scale = 1000;
    }
}

export default new Config();
