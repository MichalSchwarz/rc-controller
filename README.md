# rc-controller

[![Build Status](https://travis-ci.org/MichalSchwarz/rc-controller.svg?branch=master)](https://travis-ci.org/MichalSchwarz/rc-controller)
[![Coverage Status](https://coveralls.io/repos/github/MichalSchwarz/rc-controller/badge.svg?branch=master)](https://coveralls.io/github/MichalSchwarz/rc-controller?branch=master)

[![JavaScript RC Controller](https://michalschwarz.github.io/rc-controller/assets/js-rc-controller-thumb.png)](https://michalschwarz.github.io/rc-controller/assets/js-rc-controller.png)

## Example

[How to Build a ESP32 Drone controlled by Web browser](https://michalschwarz.github.io/rc-controller/esp32/quadcopter/f450/asgard32/schema/2019/05/07/esp32-drone-v1.0.0.html)

## Usage

1. Copy the content of https://github.com/MichalSchwarz/rc-controller/blob/master/www/index.html to target device.
   * E.g. Arduino:
   ```c
   const char index_html[] PROGMEM = "COPY HERE";
   ```
2. Create the Webserver on target device with two routes.
   * `/` - Webserver simply return index.html
   * `/control` - Here you'll recieve control commands e.g. `/control?y=26&t=64&p=50&r=50&1=0`

## Videos

* [F450 + Asgard32 F7](https://www.youtube.com/watch?v=F2IpekwRwj8)
* [First flight video](https://www.youtube.com/watch?v=AE7AcuQcWvU)
