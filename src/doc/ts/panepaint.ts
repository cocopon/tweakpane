import {Tweakpane} from 'tweakpane';

import {
	colorFromString,
	colorToFunctionalRgbaString,
} from '../../../lib/input-binding/color/converter/color-string';
import {Color} from '../../../lib/input-binding/color/model/color';
import {createTheme, ThemeId} from './themes';

export type ThemeProperty =
	| 'base-background-color'
	| 'base-shadow-color'
	| 'button-background-color'
	| 'button-background-color-active'
	| 'button-background-color-focus'
	| 'button-background-color-hover'
	| 'button-foreground-color'
	| 'container-background-color'
	| 'container-background-color-active'
	| 'container-background-color-focus'
	| 'container-background-color-hover'
	| 'container-foreground-color'
	| 'groove-foreground-color'
	| 'input-background-color'
	| 'input-background-color-active'
	| 'input-background-color-focus'
	| 'input-background-color-hover'
	| 'input-foreground-color'
	| 'label-foreground-color'
	| 'monitor-background-color'
	| 'monitor-foreground-color';

export type Theme = {
	[property in ThemeProperty]: string;
};

interface ThemePaneGroup {
	expanded?: boolean;
	label: (prop: string) => string;
	name: string;
	props: string[];
}

const GROUPS: ThemePaneGroup[] = [
	{
		name: 'Base',
		expanded: true,
		props: ['base-background-color', 'base-shadow-color'],
		label: (prop: string): string => {
			const m = prop.match(/^base-(.+)-color$/);
			return (m && m[1]) || prop;
		},
	},
	{
		name: 'Input',
		props: [
			'input-foreground-color',
			'input-background-color',
			'input-background-color:state',
		],
		label: (prop: string): string => {
			const m = prop.match(/^input-(.+)-color(-.+)?$/);
			return (m && `${m[1]}${m[2] || ''}`) || prop;
		},
	},
	{
		name: 'Monitor',
		props: ['monitor-foreground-color', 'monitor-background-color'],
		label: (prop: string): string => {
			const m = prop.match(/^monitor-(.+)-color(-.+)?$/);
			return (m && `${m[1]}${m[2] || ''}`) || prop;
		},
	},
	{
		name: 'Button',
		props: [
			'button-foreground-color',
			'button-background-color',
			'button-background-color:state',
		],
		label: (prop: string): string => {
			const m = prop.match(/^button-(.+)-color(-.+)?$/);
			return (m && `${m[1]}${m[2] || ''}`) || prop;
		},
	},
	{
		name: 'Container',
		props: [
			'container-foreground-color',
			'container-background-color',
			'container-background-color:state',
		],
		label: (prop: string): string => {
			const m = prop.match(/^container-(.+)-color(-.+)?$/);
			return (m && `${m[1]}${m[2] || ''}`) || prop;
		},
	},
	{
		name: 'Misc',
		expanded: true,
		props: ['label-foreground-color', 'groove-foreground-color'],
		label: (prop: string): string => {
			const m = prop.match(/^(.+)-color(-.+)?$/);
			return (m && `${m[1]}${m[2] || ''}`) || prop;
		},
	},
];

export function createPane(container: HTMLElement, theme: Theme): any {
	const pane = new Tweakpane({
		container: container,
		title: 'Panepaint',
	});

	const presetObj = {
		preset: 'Select...',
	};
	pane
		.addInput(presetObj, 'preset', {
			options: {
				'Select...': '',
				Default: 'default',
				Iceberg: 'iceberg',
				Jetblack: 'jetblack',
				Light: 'light',
				Retro: 'retro',
				Translucent: 'translucent',
				Vivid: 'vivid',
			},
		})
		.on('change', (ev) => {
			if (ev.value === '') {
				return;
			}

			const t = createTheme(ev.value as ThemeId);
			Object.keys(t).forEach((key) => {
				const prop = key as ThemeProperty;
				theme[prop] = t[prop];
			});
			presetObj.preset = '';
			pane.refresh();
		});
	pane
		.addButton({
			label: 'bg-image',
			title: 'Shuffle',
		})
		.on('click', () => {
			const bgElem = document.querySelector(
				'.paint_bgImage',
			) as HTMLElement | null;
			if (!bgElem) {
				return;
			}
			const now = new Date().getTime();
			bgElem.style.backgroundImage = `url(https://source.unsplash.com/collection/91620523?date=${now})`;

			const creditElems: HTMLElement[] = Array.prototype.slice.call(
				document.querySelectorAll('.paint .photoCredit'),
			);
			creditElems.forEach((elem, index) => {
				elem.style.visibility = index === 0 ? 'visible' : 'hidden';
			});
		});

	GROUPS.forEach((group) => {
		const f = pane.addFolder({
			expanded: !!group.expanded,
			title: group.name,
		});
		group.props.forEach((prop) => {
			const m = prop.match(/(.+):state$/);
			if (!m) {
				f.addInput(theme, prop, {
					label: group
						.label(prop)
						.replace('background', 'bg')
						.replace('foreground', 'fg'),
				});
				return;
			}

			const sf = f.addFolder({
				title: 'State',
			});
			sf.addButton({
				title: 'Autofill',
			}).on('click', () => {
				const value = theme[m[1] as ThemeProperty];
				const c = colorFromString(value);
				const hslComps = c.getComponents('hsl');
				const sign = hslComps[2] > 50 ? -1 : +1;
				theme[`${m[1]}-hover` as ThemeProperty] = colorToFunctionalRgbaString(
					new Color(
						[hslComps[0], hslComps[1], hslComps[2] + 5 * sign, hslComps[3]],
						'hsl',
					),
				);
				theme[`${m[1]}-focus` as ThemeProperty] = colorToFunctionalRgbaString(
					new Color(
						[hslComps[0], hslComps[1], hslComps[2] + 10 * sign, hslComps[3]],
						'hsl',
					),
				);
				theme[`${m[1]}-active` as ThemeProperty] = colorToFunctionalRgbaString(
					new Color(
						[hslComps[0], hslComps[1], hslComps[2] + 15 * sign, hslComps[3]],
						'hsl',
					),
				);
				pane.refresh();
			});
			const baseProp = m[1];
			['active', 'focus', 'hover'].forEach((state) => {
				const prop = [baseProp, state].join('-');
				sf.addInput(theme, prop, {
					label: group
						.label(prop)
						.replace('background', 'bg')
						.replace('foreground', 'fg'),
				});
			});
		});
	});

	return pane;
}

export function toCss(selector: string, theme: Theme): string {
	const decls = Object.keys(theme).reduce((result: string[], key: string) => {
		const prop = key as ThemeProperty;
		const a = theme[prop];
		return ([] as string[]).concat(result, `  --tp-${key}: ${a};`);
	}, []);

	return [`${selector} {`, ...decls, '}'].join('\n');
}
