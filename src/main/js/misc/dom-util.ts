import TypeUtil from './type-util';

export const SVG_NS: string = 'http://www.w3.org/2000/svg';

export function forceReflow(element: HTMLElement): void {
	// tslint:disable-next-line:no-unused-expression
	element.offsetHeight;
}

export function disableTransitionTemporarily(
	element: HTMLElement,
	callback: () => void,
): void {
	const t = element.style.transition;
	element.style.transition = 'none';

	callback();

	element.style.transition = t;
}

export function supportsTouch(document: Document): boolean {
	return document.ontouchstart !== undefined;
}

export function getWindowDocument(): Document {
	// tslint:disable-next-line:function-constructor
	const globalObj: Window = TypeUtil.forceCast(new Function('return this')());
	return globalObj.document;
}

function isBrowser(): boolean {
	// Webpack defines process.browser = true;
	// https://github.com/webpack/node-libs-browser
	// https://github.com/defunctzombie/node-process
	return !!(process as any).browser;
}

export function getCanvasContext(
	canvasElement: HTMLCanvasElement,
): CanvasRenderingContext2D | null {
	// HTMLCanvasElement.prototype.getContext is not defined on testing environment
	return isBrowser() ? canvasElement.getContext('2d') : null;
}

type IconId = 'p2dpad';

// tslint:disable: max-line-length
const ICON_ID_TO_INNER_HTML_MAP: {[key in IconId]: string} = {
	p2dpad:
		'<path d="M8 2V14" stroke="currentColor" stroke-width="1.5"/><path d="M2 8H14" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="2" fill="currentColor"/>',
};

export function createSvgIconElement(
	document: Document,
	iconId: IconId,
): Element {
	const elem = document.createElementNS(SVG_NS, 'svg');
	elem.innerHTML = ICON_ID_TO_INNER_HTML_MAP[iconId];
	return elem;
}
