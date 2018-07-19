# rc-controller

[![Build Status](https://travis-ci.org/MichalSchwarz/rc-controller.svg?branch=master)](https://travis-ci.org/MichalSchwarz/rc-controller)
[![Coverage Status](https://coveralls.io/repos/github/MichalSchwarz/rc-controller/badge.svg?branch=master)](https://coveralls.io/github/MichalSchwarz/rc-controller?branch=master)

## Usage

1. Copy the vontent of https://github.com/MichalSchwarz/rc-controller/blob/master/www/index.html to target device.
   * E.g. Arduino:
   ```c
   const char index_html[] PROGMEM = "COPY HERE";
   ```
2. Create the Webserver on target device with two routes.
   * `/` - Webserver simply return index.html
   * `/control` - Here you'll recieve control commands e.g. `/control?y=26&t=64&p=50&r=50&1=0`
   
## Videos

[First flight video](https://www.youtube.com/watch?v=AE7AcuQcWvU)
