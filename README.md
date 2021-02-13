# Tweakpane
![CI](https://github.com/cocopon/tweakpane/workflows/CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/cocopon/tweakpane/badge.svg)](https://coveralls.io/github/cocopon/tweakpane)
[![npm version](https://badge.fury.io/js/tweakpane.svg)](https://badge.fury.io/js/tweakpane)


Tweakpane is a compact pane library for fine-tuning parameters and monitoring
value changes, inspired by [dat.GUI][].

![cover](https://user-images.githubusercontent.com/602961/107842321-b675d700-6e05-11eb-8d9b-69895b35fe39.jpg)




## Concept
- Clean and simple interface
- Easy to use, [user-friendly documents][documents]
- Mobile support




## Features
- [Inputs](https://cocopon.github.io/tweakpane/input.html)
  - Number (text / slider / list)
  - String (text / list)
  - Boolean (checkbox / list)
  - Color (picker)
  - Point2D (picker)
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

See the [official page][documents] for more detailed information.




## Development
`npm start` for development. It starts a web server for the online document,
building source files, watching changes for the next build. After executing the
command, open `http://localhost:8080/` for browsing the document.




## License
MIT License. See `LICENSE.txt` for more information.




[dat.GUI]: https://github.com/dataarts/dat.gui
[documents]: https://cocopon.github.io/tweakpane/
