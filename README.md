# Tweakpane
![CI](https://github.com/cocopon/tweakpane/workflows/CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/cocopon/tweakpane/badge.svg)](https://coveralls.io/github/cocopon/tweakpane)
[![npm version](https://badge.fury.io/js/tweakpane.svg)](https://badge.fury.io/js/tweakpane)

![cover](https://user-images.githubusercontent.com/602961/146529897-38829c6f-56df-46f6-81fe-d65fb2027eaa.png)

Tweakpane is a compact pane library for fine-tuning parameters and monitoring
value changes, inspired by [dat.GUI][].

- Clean and simple design
- Dependency-free
- Extensible

(dat.GUI user? The [migration guide](https://tweakpane.github.io/docs/migration/#datgui) can be helpful)


## Installation
Refer to the [Getting Started](https://tweakpane.github.io/docs/getting-started/) section for concrete steps. Remember to install `@tweakpane/core` if you are developing with TypeScript.


## Features
See the [official page][documents] for details.


### [Bindings](https://tweakpane.github.io/docs/input-bindings/)
Number, String, Boolean, Color, Point 2D/3D/4D

![Bindings](https://user-images.githubusercontent.com/602961/184479032-38f50be3-e235-4914-85c0-dce316b33ed2.png)


### [Readonly bindings](https://tweakpane.github.io/docs/monitor-bindings/)
Number, String, Boolean

![Readonly bindings](https://user-images.githubusercontent.com/602961/184479060-44fda993-9f40-4ef1-b363-18e9f9deff7f.png)


### [UI components](https://tweakpane.github.io/docs/ui-components/)
Folder, Tab, Button, Separator

![UI components](https://user-images.githubusercontent.com/602961/184479079-84ee5436-b5f6-4c35-92eb-94cc8709ff12.png)


### [Theming](https://tweakpane.github.io/docs/theming/)
![Theming](https://user-images.githubusercontent.com/602961/115102105-e6676500-9f83-11eb-8a74-ae4f76122000.png)


### [Plugins](https://tweakpane.github.io/docs/plugins/)
![Plugins](https://user-images.githubusercontent.com/602961/184479086-cc8c72c2-c958-4e4e-8ae4-2690f721c544.png)


### [Misc](https://tweakpane.github.io/docs/misc/)
- Mobile support
- TypeScript type definitions
- JSON import / export


## Development


### CommonJS and ES modules
From version 4, Tweakpane has been migrated to ES modules. If you are looking for a CommonJS version of the package, use version 3.x.


### Build your own Tweakpane

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
[documents]: https://tweakpane.github.io/docs/
