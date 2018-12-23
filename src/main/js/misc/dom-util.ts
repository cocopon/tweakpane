import FlowUtil from './flow-util';

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
	const globalObj: Window = FlowUtil.forceCast(new Function('return this')());
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
