import {
	ButtonBladeParams,
	FolderBladeParams,
	SeparatorBladeParams,
	TabBladeParams,
} from '@tweakpane/core';
import {toCss} from 'ts/panepaint';
import {createTheme, ThemeId} from 'ts/themes';
import {
	ListBladeParams,
	Pane,
	SliderBladeParams,
	TextBladeParams,
} from 'tweakpane';

import {selectContainer, wave} from '../util';

function createThemePane(container: HTMLElement): Pane {
	const pane = new Pane({
		container: container,
		title: 'Theme',
	});
	pane.addInput({text: 0}, 'text');
	pane.addInput({slider: 0}, 'slider', {
		min: -1,
		max: 1,
	});
	pane.addButton({title: 'Button'});
	return pane;
}

export function initCatalog() {
	const disabled = location.search.includes('disabled');

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
			pane.addInput(params, 'number', {
				disabled: disabled,
				label: 'text',
			});
			pane.addInput(params, 'number', {
				disabled: disabled,
				label: 'slider',
				min: -100,
				max: 100,
			});
			pane.addInput(params, 'number', {
				disabled: disabled,
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
			pane.addInput(params, 'string', {
				disabled: disabled,
				label: 'text',
			});
			pane.addInput(params, 'string', {
				disabled: disabled,
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
			pane.addInput(params, 'bool', {
				disabled: disabled,
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
			pane.addInput(params, 'color', {
				disabled: disabled,
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
			pane.addInput(params, 'p2d', {
				disabled: disabled,
				expanded: true,
				label: '2d-picker',
				picker: 'inline',
			});
			pane.addInput(params, 'p3d', {
				disabled: disabled,
				label: '3d-text',
			});
			pane.addInput(params, 'p4d', {
				disabled: disabled,
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
			pane.addMonitor(params, 'number', {
				disabled: disabled,
				label: 'text',
			});
			pane.addMonitor(params, 'number', {
				bufferSize: 10,
				disabled: disabled,
				label: 'multiline',
			});
			pane.addMonitor(params, 'number', {
				disabled: disabled,
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
			pane.addMonitor(params, 'string', {
				disabled: disabled,
				interval: 1000,
				label: 'text',
			});
			pane.addMonitor(params, 'string', {
				bufferSize: 10,
				disabled: disabled,
				interval: 1000,
				label: 'multiline',
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
			pane.addMonitor(params, 'bool', {
				disabled: disabled,
				interval: 1000,
				label: 'text',
			});
			pane.addMonitor(params, 'bool', {
				bufferSize: 10,
				disabled: disabled,
				interval: 1000,
				label: 'multiline',
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
			f.addInput({param: 0}, 'param', {disabled: disabled});
			const sf = f.addFolder({
				title: 'Subfolder',
			});
			sf.addInput({param: 0}, 'param', {disabled: disabled});
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
			t.pages[0].addInput({param: 0}, 'param', {disabled: disabled});
			const st = t.pages[0].addTab({
				pages: [{title: 'Page'}, {title: 'Page'}],
			});
			st.pages[0].addInput({param: 0}, 'param', {disabled: disabled});
			return pane;
		},
		button: (container) => {
			const pane = new Pane({
				container: container,
				title: 'Button',
			});
			pane.addButton({
				disabled: disabled,
				label: 'label',
				title: 'Button',
			});
			pane.addButton({
				disabled: disabled,
				title: 'Button',
			});
			return pane;
		},
		separator: (container) => {
			const pane = new Pane({
				container: container,
				title: 'Separator',
			});
			pane.addInput({param: 0}, 'param', {disabled: disabled});
			pane.addSeparator();
			pane.addInput({param: 0}, 'param', {disabled: disabled});
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
					disabled: disabled,
					label: 'label',
					title: 'Button',
					view: 'button',
				} as ButtonBladeParams,
				{
					disabled: disabled,
					view: 'separator',
				} as SeparatorBladeParams,
				{
					disabled: disabled,
					expanded: false,
					title: 'Folder',
					view: 'folder',
				} as FolderBladeParams,
				{
					disabled: disabled,
					label: 'label',
					parse: (v: string) => v,
					value: 'text',
					view: 'text',
				} as TextBladeParams<string>,
				{
					disabled: disabled,
					label: 'label',
					options: {option: 0},
					value: 0,
					view: 'list',
				} as ListBladeParams<number>,
				{
					disabled: disabled,
					label: 'label',
					max: 100,
					min: 0,
					value: 50,
					view: 'slider',
				} as SliderBladeParams,
				{
					disabled: disabled,
					pages: [{title: 'Tab'}, {title: 'Tab'}],
					view: 'tab',
				} as TabBladeParams,
			].forEach((params) => {
				pane.addBlade(params);
			});
			return pane;
		},
		nestedfolders: (container) => {
			const pane = new Pane({
				container: container,
				title: 'Nested Folders',
			});

			((f) => {
				((sf) => {
					sf.addInput({param: 0}, 'param');
					sf.addInput({param: 0}, 'param');
				})(f.addFolder({title: 'Folder'}));
				((sf) => {
					sf.addInput({param: 0}, 'param');
					sf.addInput({param: 0}, 'param');
				})(f.addFolder({title: 'Folder'}));
			})(pane.addFolder({title: 'Folder'}));
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
}
