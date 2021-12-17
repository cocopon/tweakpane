# Tweakpane
![CI](https://github.com/cocopon/tweakpane/workflows/CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/cocopon/tweakpane/badge.svg)](https://coveralls.io/github/cocopon/tweakpane)
[![npm version](https://badge.fury.io/js/tweakpane.svg)](https://badge.fury.io/js/tweakpane)

![cover](https://user-images.githubusercontent.com/602961/146529897-38829c6f-56df-46f6-81fe-d65fb2027eaa.png)

Tweakpane is a compact pane library for fine-tuning parameters and monitoring
value changes, inspired by [dat.GUI][].


## Concept
- Clean and simple design
- Dependency-free
- Extensible
- Mobile support


## Features
See the [official page][documents] for details.


### [Input bindings](https://cocopon.github.io/tweakpane/input.html)
Number, String, Boolean, Color, Point 2D/3D/4D

![Input bindings](https://user-images.githubusercontent.com/602961/115102111-e9faec00-9f83-11eb-8770-8da0abbd7363.png)


### [Monitor bindings](https://cocopon.github.io/tweakpane/monitor.html)
Number, String, Boolean

![Monitor bindings](https://user-images.githubusercontent.com/602961/115102110-e9625580-9f83-11eb-88a6-7fa3557250c8.png)


### [UI components](https://cocopon.github.io/tweakpane/ui-components.html)
Folder, Tab, Button, Separator

![UI components](https://user-images.githubusercontent.com/602961/115102108-e8312880-9f83-11eb-9c7e-f2968397bff9.png)


### [Theming](https://cocopon.github.io/tweakpane/theming.html)
![Theming](https://user-images.githubusercontent.com/602961/115102105-e6676500-9f83-11eb-8a74-ae4f76122000.png)


### [Plugins](https://cocopon.github.io/tweakpane/plugins.html)
![Plugins](https://user-images.githubusercontent.com/602961/122059107-41ec8c80-ce27-11eb-9d17-08c522efb05f.png)


### [Misc](https://cocopon.github.io/tweakpane/misc.html)
- JSON import / export
- TypeScript type definitions


## Development
```
$ npm install
$ npm run setup
$ cd packages/tweakpane
$ npm start
```

The above commands start a web server for the document, build source files, and
watch for changes. Open `http://localhost:8080/` to browse the document.


## License
MIT License. See `LICENSE.txt` for more information.


[dat.GUI]: https://github.com/dataarts/dat.gui
[documents]: https://cocopon.github.io/tweakpane/
