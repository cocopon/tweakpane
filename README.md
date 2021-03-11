# Tweakpane
![CI](https://github.com/cocopon/tweakpane/workflows/CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/cocopon/tweakpane/badge.svg)](https://coveralls.io/github/cocopon/tweakpane)
[![npm version](https://badge.fury.io/js/tweakpane.svg)](https://badge.fury.io/js/tweakpane)

![cover](https://user-images.githubusercontent.com/602961/110850209-da3c1800-82f2-11eb-8504-23591d167fdd.jpg)

Tweakpane is a compact pane library for fine-tuning parameters and monitoring
value changes, inspired by [dat.GUI][].


## Concept
- Clean and simple
- Dependency-free
- Mobile support


## Features
See the [official page][documents] for details.

- [Inputs](https://cocopon.github.io/tweakpane/input.html)
  - Number (text / slider / list)
  - String (text / list)
  - Boolean (checkbox / list)
  - Color (picker)
  - Point2D (picker)
  - Point3D (text)
- [Monitors](https://cocopon.github.io/tweakpane/monitor.html)
  - Number (text / graph)
  - String (text)
  - Boolean (text)
- [UI components](https://cocopon.github.io/tweakpane/ui-components.html)
  - Folder
  - Button
  - Separator
- [Theming](https://cocopon.github.io/tweakpane/theming.html)
- [Misc](https://cocopon.github.io/tweakpane/misc.html)
  - JSON import / export
  - TypeScript type definitions
- [Plugin](https://cocopon.github.io/tweakpane/plugin.html)


## Development
`npm start` for development. It starts a web server for the online document,
building source files, watching changes for the next build. After executing the
command, open `http://localhost:8080/` for browsing the document.


## License
MIT License. See `LICENSE.txt` for more information.


[dat.GUI]: https://github.com/dataarts/dat.gui
[documents]: https://cocopon.github.io/tweakpane/
