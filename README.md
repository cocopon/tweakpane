# Tweakpane
[![GitHub Actions](https://github.com/cocopon/tweakpane/workflows/CI/badge.svg)](https://github.com/cocopon/tweakpane/actions)
[![Coverage Status](https://coveralls.io/repos/github/cocopon/tweakpane/badge.svg)](https://coveralls.io/github/cocopon/tweakpane)
[![npm version](https://badge.fury.io/js/tweakpane.svg)](https://badge.fury.io/js/tweakpane)


Tweakpane is a compact pane library for fine-tuning parameters and monitoring
value changes. It's originally inspired by the popular library [dat.GUI][].

![Screenshot](https://user-images.githubusercontent.com/602961/48275901-0c6eae00-e48a-11e8-925a-4d067ce4ace4.png)




## Concept
- Clean and simple interface
- Easy to use, [user-friendly documents][documents]
- Mobile support




## Features
- [Input](https://cocopon.github.io/tweakpane/input.html)
  - Number (text / slider / list)
  - String (text / list)
  - Boolean (checkbox / list)
  - Color (picker)
  - Point2D (picker)
- [Monitor](https://cocopon.github.io/tweakpane/monitor.html)
  - Number (text / graph)
  - String (text)
  - Boolean (text)
- [UI components](https://cocopon.github.io/tweakpane/misc.html)
  - Folder
  - Button
  - Separator
- Misc
  - JSON import / export
  - TypeScript type definitions

See the [official page][documents] for more detailed information.




## Development
`npm start` for development. It starts a web server for the online document,
building source files, watching changes for the next build. After executing the
command, open `http://localhost:8080/` for browsing the document.




## License
MIT License. See `LICENSE.txt` for more information.




[dat.GUI]: https://workshop.chromeexperiments.com/examples/gui/
[documents]: https://cocopon.github.io/tweakpane/
