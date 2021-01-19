import * as Util from '../util';

declare let hljs: any;
declare let Tweakpane: any;

interface ThemeParams {
	cssProps: string[];
	id: string;
	title: string;
}

export const ThemingRoute = {
	pathname: /^(\/tweakpane)?\/theming\.html$/,

	init: () => {
		const showTheme = (params: ThemeParams) => {
			const elem = document.querySelector('*[data-themeCss]');
			if (!elem) {
				return;
			}

			const indentedProps = params.cssProps
				.map((cssProp) => `  ${cssProp}`)
				.join('\n');

			elem.textContent = `<!-- Example theme: ${params.title} -->
<!-- Copy and paste the element into your head element -->
<style>
:root {
${indentedProps}
}
</style>`;
			hljs.highlightBlock(elem);
		};

		const setUpThemedPane = (
			container: HTMLElement | null,
			params?: ThemeParams,
		) => {
			const PARAMS = {
				background: '#f1f2f3',
				point2d: {x: 0, y: 0},
				slider: 0,
				variables: (params && params.cssProps.join('\n')) || '',
			};

			const pane = new Tweakpane({
				container: container,
				title: (params && params.title) || 'Default',
			});
			pane.addInput(PARAMS, 'slider', {
				max: 64,
				min: 0,
			});
			pane.addSeparator();
			pane.addInput(PARAMS, 'point2d');

			if (!params) {
				const fp = pane.addFolder({
					title: 'Preview',
				});
				fp.addInput(PARAMS, 'background').on('change', () => {
					document.documentElement.style.setProperty(
						'--themes-background-color',
						PARAMS.background,
					);
				});
				return;
			}

			const styleElem = document.createElement('style');
			styleElem.textContent = `.common-paneContainer-${
				params.id
			}Theme {${params.cssProps.join('')}}`;
			document.head.appendChild(styleElem);

			const f = pane.addFolder({
				title: 'CSS',
			});
			f.addMonitor(PARAMS, 'variables', {
				interval: 0,
				multiline: true,
			});
			f.addButton({
				title: 'Show',
			}).on('click', () => {
				showTheme(params);
			});
		};

		const markerToFnMap: {
			[key: string]: (container: HTMLElement | null) => void;
		} = {
			defaultTheme: (container) => {
				return setUpThemedPane(container);
			},

			jetblackTheme: (container) => {
				const params = {
					cssProps: [
						'/* Base colors */',
						'--tp-base-background-color: hsl(0, 0%, 0%);',
						'--tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);',
						'',
						'/* Button-like control colors */',
						'--tp-button-background-color: hsl(0, 0%, 70%);',
						'--tp-button-background-color-active: hsl(0, 0%, 85%);',
						'--tp-button-background-color-focus: hsl(0, 0%, 80%);',
						'--tp-button-background-color-hover: hsl(0, 0%, 75%);',
						'--tp-button-foreground-color: var(--tp-base-background-color);',
						'',
						'/* Folder colors */',
						'--tp-folder-background-color: hsl(0, 0%, 10%);',
						'--tp-folder-background-color-active: hsl(0, 0%, 25%);',
						'--tp-folder-background-color-focus: hsl(0, 0%, 20%);',
						'--tp-folder-background-color-hover: hsl(0, 0%, 15%);',
						'--tp-folder-foreground-color: hsl(0, 0%, 50%);',
						'',
						'/* Input control colors */',
						'--tp-input-background-color: hsl(0, 0%, 10%);',
						'--tp-input-background-color-active: hsl(0, 0%, 25%);',
						'--tp-input-background-color-focus: hsl(0, 0%, 20%);',
						'--tp-input-background-color-hover: hsl(0, 0%, 15%);',
						'--tp-input-foreground-color: hsl(0, 0%, 70%);',
						'--tp-input-guide-color: hsla(0, 0%, 100%, 5%);',
						'',
						'/* Monitor control colors */',
						'--tp-monitor-background-color: hsl(0, 0%, 8%);',
						'--tp-monitor-foreground-color: hsl(0, 0%, 48%);',
						'',
						'/* Misc */',
						'--tp-label-foreground-color: hsl(0, 0%, 50%);',
						'--tp-separator-color: hsl(0, 0%, 10%);',
					],
					id: 'jetblack',
					title: 'Jetblack',
				};
				showTheme(params);
				return setUpThemedPane(container, params);
			},

			lightTheme: (container) => {
				return setUpThemedPane(container, {
					cssProps: [
						'/* Base colors */',
						'--tp-base-background-color: hsl(230deg, 5%, 90%);',
						'--tp-base-shadow-color: hsla(0, 0%, 0%, 0.1);',
						'',
						'/* Button-like control colors */',
						'--tp-button-background-color: hsl(230deg, 5%, 70%);',
						'--tp-button-background-color-active: hsl(230deg, 5%, 55%);',
						'--tp-button-background-color-focus: hsl(230deg, 5%, 60%);',
						'--tp-button-background-color-hover: hsl(230deg, 5%, 65%);',
						'--tp-button-foreground-color: hsl(230deg, 5%, 20%);',
						'',
						'/* Folder colors */',
						'--tp-folder-background-color: hsl(230deg, 5%, 80%);',
						'--tp-folder-background-color-active: hsl(230deg, 5%, 65%);',
						'--tp-folder-background-color-focus: hsl(230deg, 5%, 70%);',
						'--tp-folder-background-color-hover: hsl(230deg, 5%, 75%);',
						'--tp-folder-foreground-color: var(--tp-input-foreground-color);',
						'',
						'/* Input control colors */',
						'--tp-input-background-color: hsl(230deg, 5%, 85%);',
						'--tp-input-background-color-active: hsl(230deg, 5%, 70%);',
						'--tp-input-background-color-focus: hsl(230deg, 5%, 75%);',
						'--tp-input-background-color-hover: hsl(230deg, 5%, 80%);',
						'--tp-input-foreground-color: hsl(230deg, 5%, 30%);',
						'--tp-input-guide-color: hsla(230deg, 5%, 30%, 10%);',
						'',
						'/* Monitor control colors */',
						'--tp-monitor-background-color: var(--tp-input-background-color);',
						'--tp-monitor-foreground-color: hsl(230deg, 5%, 60%);',
						'',
						'/* Misc */',
						'--tp-label-foreground-color: hsl(230deg, 5%, 50%);',
						'--tp-separator-color: hsl(230deg, 5%, 85%);',
					],
					id: 'light',
					title: 'Light',
				});
			},

			icebergTheme: (container) => {
				return setUpThemedPane(container, {
					cssProps: [
						'/* Base colors */',
						'--tp-base-background-color: hsl(230deg, 20%, 11%);',
						'--tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);',
						'',
						'/* Button-like control colors */',
						'--tp-button-background-color: hsl(230deg, 10%, 80%);',
						'--tp-button-background-color-active: hsl(230deg, 10%, 95%);',
						'--tp-button-background-color-focus: hsl(230deg, 10%, 90%);',
						'--tp-button-background-color-hover: hsl(230deg, 10%, 85%);',
						'--tp-button-foreground-color: var(--tp-base-background-color);',
						'',
						'/* Folder colors */',
						'--tp-folder-background-color: hsl(230deg, 25%, 16%);',
						'--tp-folder-background-color-active: hsl(230deg, 25%, 31%);',
						'--tp-folder-background-color-focus: hsl(230deg, 25%, 26%);',
						'--tp-folder-background-color-hover: hsl(230deg, 25%, 21%);',
						'--tp-folder-foreground-color: var(--tp-input-foreground-color);',
						'',
						'/* Input control colors */',
						'--tp-input-background-color: hsl(230deg, 20%, 8%);',
						'--tp-input-background-color-active: hsl(230deg, 28%, 26%);',
						'--tp-input-background-color-focus: hsl(230deg, 28%, 21%);',
						'--tp-input-background-color-hover: hsl(230deg, 20%, 16%);',
						'--tp-input-foreground-color: hsl(230deg, 10%, 80%);',
						'--tp-input-guide-color: hsla(230deg, 10%, 80%, 5%);',
						'',
						'/* Monitor control colors */',
						'--tp-monitor-background-color: hsl(230deg, 20%, 8%);',
						'--tp-monitor-foreground-color: hsl(230deg, 12%, 48%);',
						'',
						'/* Misc */',
						'--tp-label-foreground-color: hsl(230deg, 12%, 48%);',
						'--tp-separator-color: hsl(230deg, 20%, 8%);',
					],
					id: 'iceberg',
					title: 'Iceberg',
				});
			},
		};
		Object.keys(markerToFnMap).forEach((marker) => {
			const initFn = markerToFnMap[marker];
			const container = Util.selectContainer(marker);
			initFn(container);
		});
	},
};
