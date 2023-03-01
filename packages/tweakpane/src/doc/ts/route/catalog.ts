import {
	ButtonBladeParams,
	FolderBladeParams,
	TabBladeParams,
} from '@tweakpane/core';
import {toCss} from 'ts/panepaint';
import {createTheme, ThemeId} from 'ts/themes';
import {
	ListBladeParams,
	Pane,
	SeparatorBladeParams,
	SliderBladeParams,
	TextBladeParams,
} from 'tweakpane';

import {selectContainer, wave} from '../util';

function createThemePane(container: HTMLElement): Pane {
	const pane = new Pane({
		container: container,
		title: 'Theme',
	});
	pane.addBinding({text: 0}, 'text');
	pane.addBinding({slider: 0}, 'slider', {
		min: -1,
		max: 1,
	});
	pane.addButton({title: 'Button'});
	return pane;
}

export function initCatalog() {
	if (location.search.includes('readme')) {
		// Preparing for readme images
		document.documentElement.classList.add('readme');
	}

	(['jetblack', 'iceberg', 'light'] as ThemeId[]).forEach((id: ThemeId) => {
		const theme = createTheme(id);
		const elem = document.createElement('style');
		elem.textContent = toCss(`*[data-pane-${id}theme]`, theme);
		document.head.appendChild(elem);
	});

	const markerToFnMap: {
		[key: string]: (container: HTMLElement) => Pane;
	} = {
		numberinput: (container) => {
			const params = {
				number: 0,
			};
			const pane = new Pane({
				container: container,
				title: 'Number',
			});
			pane.addBinding(params, 'number', {
				label: 'text',
			});
			pane.addBinding(params, 'number', {
				label: 'slider',
				min: -100,
				max: 100,
			});
			pane.addBinding(params, 'number', {
				label: 'list',
				options: {
					option: 0,
				},
			});
			return pane;
		},
		stringinput: (container) => {
			const params = {
				string: 'text',
			};
			const pane = new Pane({
				container: container,
				title: 'String',
			});
			pane.addBinding(params, 'string', {
				label: 'text',
			});
			pane.addBinding(params, 'string', {
				label: 'list',
				options: {
					option: 'text',
				},
			});
			return pane;
		},
		boolinput: (container) => {
			const params = {
				bool: true,
			};
			const pane = new Pane({
				container: container,
				title: 'Boolean',
			});
			pane.addBinding(params, 'bool', {
				label: 'checkbox',
			});
			return pane;
		},
		colorinput: (container) => {
			const params = {
				color: '#ff00007f',
			};
			const pane = new Pane({
				container: container,
				title: 'Color',
			});
			pane.addBinding(params, 'color', {
				expanded: true,
				label: 'picker',
				picker: 'inline',
			});
			return pane;
		},
		pointinput: (container) => {
			const params = {
				p2d: {x: 0, y: 0},
				p3d: {x: 0, y: 0, z: 0},
				p4d: {x: 0, y: 0, z: 0, w: 0},
			};
			const pane = new Pane({
				container: container,
				title: 'Point',
			});
			pane.addBinding(params, 'p2d', {
				expanded: true,
				label: '2d-picker',
				picker: 'inline',
			});
			pane.addBinding(params, 'p3d', {
				label: '3d-text',
			});
			pane.addBinding(params, 'p4d', {
				label: '4d-text',
			});
			return pane;
		},
		numbermonitor: (container) => {
			const params = {
				number: 0,
			};
			let wavet = 0;
			setInterval(() => {
				params.number = wave(wavet);
				wavet += 1;
			}, 50);

			const pane = new Pane({
				container: container,
				title: 'Number',
			});
			pane.addBinding(params, 'number', {
				label: 'text',
				readonly: true,
			});
			pane.addBinding(params, 'number', {
				bufferSize: 10,
				label: 'multiline',
			});
			pane.addBinding(params, 'number', {
				label: 'graph',
				max: +1,
				min: -1,
				view: 'graph',
			});
			return pane;
		},
		stringmonitor: (container) => {
			const params = {
				string: new Date().toISOString(),
			};
			setInterval(() => {
				params.string = new Date().toISOString();
			}, 1000);

			const pane = new Pane({
				container: container,
				title: 'String',
			});
			pane.addBinding(params, 'string', {
				interval: 1000,
				label: 'text',
				readonly: true,
			});
			pane.addBinding(params, 'string', {
				bufferSize: 10,
				interval: 1000,
				label: 'multiline',
				readonly: true,
			});
			return pane;
		},
		boolmonitor: (container) => {
			const params = {
				bool: true,
			};
			setInterval(() => {
				params.bool = !params.bool;
			}, 1000);

			const pane = new Pane({
				container: container,
				title: 'Boolean',
			});
			pane.addBinding(params, 'bool', {
				interval: 1000,
				label: 'text',
				readonly: true,
			});
			pane.addBinding(params, 'bool', {
				bufferSize: 10,
				interval: 1000,
				label: 'multiline',
				readonly: true,
			});
			return pane;
		},
		folder: (container) => {
			const pane = new Pane({
				container: container,
				title: 'Folder',
			});
			const f = pane.addFolder({
				title: 'Folder',
			});
			f.addBinding({param: 0}, 'param');
			const sf = f.addFolder({
				title: 'Subfolder',
			});
			sf.addBinding({param: 0}, 'param');
			return pane;
		},
		tab: (container) => {
			const pane = new Pane({
				container: container,
				title: 'Tab',
			});
			const t = pane.addTab({
				pages: [{title: 'Page'}, {title: 'Page'}],
			});
			t.pages[0].addBinding({param: 0}, 'param');
			const st = t.pages[0].addTab({
				pages: [{title: 'Page'}, {title: 'Page'}],
			});
			st.pages[0].addBinding({param: 0}, 'param');
			return pane;
		},
		button: (container) => {
			const pane = new Pane({
				container: container,
				title: 'Button',
			});
			pane.addButton({
				label: 'label',
				title: 'Button',
			});
			pane.addButton({
				title: 'Button',
			});
			return pane;
		},
		separator: (container) => {
			const pane = new Pane({
				container: container,
				title: 'Separator',
			});
			pane.addBinding({param: 0}, 'param');
			pane.addBlade({view: 'separator'});
			pane.addBinding({param: 0}, 'param');
			return pane;
		},
		icebergtheme: (container) => {
			return createThemePane(container);
		},
		jetblacktheme: (container) => {
			return createThemePane(container);
		},
		lighttheme: (container) => {
			return createThemePane(container);
		},
		blades: (container) => {
			const pane = new Pane({
				container: container,
				title: 'Blades',
			});

			[
				{
					label: 'label',
					title: 'Button',
					view: 'button',
				} as ButtonBladeParams,
				{
					view: 'separator',
				} as SeparatorBladeParams,
				{
					expanded: false,
					title: 'Folder',
					view: 'folder',
				} as FolderBladeParams,
				{
					label: 'label',
					parse: (v: string) => v,
					value: 'text',
					view: 'text',
				} as TextBladeParams<string>,
				{
					label: 'label',
					options: {option: 0},
					value: 0,
					view: 'list',
				} as ListBladeParams<number>,
				{
					label: 'label',
					max: 100,
					min: 0,
					value: 50,
					view: 'slider',
				} as SliderBladeParams,
				{
					pages: [{title: 'Tab'}, {title: 'Tab'}],
					view: 'tab',
				} as TabBladeParams,
			].forEach((params) => {
				pane.addBlade(params);
			});
			return pane;
		},
		rootfolder: (container) => {
			const pane = new Pane({
				container: container,
			});

			((f) => {
				f.addBinding({param: 0}, 'param');
				f.addBinding({param: 0}, 'param');
			})(pane.addFolder({title: 'Root Folder'}));
			return pane;
		},
		roottab: (container) => {
			const pane = new Pane({
				container: container,
			});

			const t = pane.addTab({
				pages: [{title: 'Root'}, {title: 'Tab'}],
			});
			t.pages[0].addBinding({param: 0}, 'param');
			t.pages[0].addBinding({param: 0}, 'param');

			// Test case for expanding a folder in the hidden container
			((f) => {
				f.addBinding({param: 0}, 'param');
				f.expanded = true;
			})(t.pages[1].addFolder({title: 'Folder', expanded: false}));

			return pane;
		},
		nestedfolders: (container) => {
			const pane = new Pane({
				container: container,
				title: 'Nested Folders',
			});

			((f) => {
				((sf) => {
					sf.addBinding({param: 0}, 'param');
					sf.addBinding({param: 0}, 'param');
				})(f.addFolder({title: 'Folder'}));
				((sf) => {
					sf.addBinding({param: 0}, 'param');
					sf.addBinding({param: 0}, 'param');
				})(f.addFolder({title: 'Folder'}));
			})(pane.addFolder({title: 'Folder'}));
			return pane;
		},
		containerlist: (container) => {
			const pane = new Pane({
				container: container,
			});

			const rf = pane.addFolder({
				title: 'Container List',
			});
			((f) => {
				f.addBinding({param: 0}, 'param');
			})(rf.addFolder({title: 'Folder'}));
			((t) => {
				t.pages[0].addBinding({param: 0}, 'param');
			})(rf.addTab({pages: [{title: 'Page'}, {title: 'Page'}]}));
			((f) => {
				f.addBinding({param: 0}, 'param');
			})(rf.addFolder({title: 'Folder'}));
			return pane;
		},
	};

	const panes: {[key: string]: Pane} = {};
	Object.keys(markerToFnMap).forEach((marker) => {
		const initFn = markerToFnMap[marker];
		const container = selectContainer(marker);
		const pane = initFn(container);
		panes[marker] = pane;
	});
	(window as any).panes = panes;

	(() => {
		const params = {
			base: {
				borderRadius: 6,
			},
			blade: {
				borderRadius: 2,
				hPadding: 4,
				valueWidth: 160,
			},
			container: {
				hPadding: 4,
				unitSize: 20,
				unitSpacing: 4,
				vPadding: 4,
			},
			disabled: false,
		};
		const pane = new Pane({
			expanded: false,
			title: 'Parameters',
		});
		pane.addBinding(params, 'disabled');
		((f) => {
			f.addBinding(params.base, 'borderRadius', {
				label: 'border-radius',
				min: 0,
				max: 16,
				step: 1,
			});
		})(pane.addFolder({title: 'base'}));
		((f) => {
			f.addBinding(params.blade, 'borderRadius', {
				label: 'border-radius',
				min: 0,
				max: 16,
				step: 1,
			});
			f.addBinding(params.blade, 'hPadding', {
				label: 'h-padding',
				min: 0,
				max: 16,
				step: 1,
			});
			f.addBinding(params.blade, 'valueWidth', {
				label: 'value-width',
				min: 100,
				max: 200,
				step: 1,
			});
		})(pane.addFolder({title: 'blade'}));
		((f) => {
			f.addBinding(params.container, 'unitSize', {
				label: 'unit-size',
				min: 8,
				max: 32,
				step: 1,
			});
			f.addBinding(params.container, 'unitSpacing', {
				label: 'unit-spacing',
				min: 0,
				max: 16,
				step: 1,
			});
			f.addBinding(params.container, 'hPadding', {
				label: 'h-padding',
				min: 0,
				max: 16,
				step: 1,
			});
			f.addBinding(params.container, 'vPadding', {
				label: 'v-padding',
				min: 0,
				max: 16,
				step: 1,
			});
		})(pane.addFolder({title: 'container'}));

		const styleElem = document.createElement('style');
		document.head.appendChild(styleElem);
		pane.on('change', () => {
			const decls = [
				`--tp-base-border-radius:${params.base.borderRadius}px`,
				`--tp-blade-border-radius:${params.blade.borderRadius}px`,
				`--tp-blade-horizontal-padding:${params.blade.hPadding}px`,
				`--tp-blade-value-width:${params.blade.valueWidth}px`,
				`--tp-container-horizontal-padding:${params.container.hPadding}px`,
				`--tp-container-unit-size:${params.container.unitSize}px`,
				`--tp-container-unit-spacing:${params.container.unitSpacing}px`,
				`--tp-container-vertical-padding:${params.container.vPadding}px`,
			];
			styleElem.textContent = `.paneContainer{${decls.join(';')}}`;

			Object.values(panes).forEach((p) => (p.disabled = params.disabled));
		});
	})();
}
