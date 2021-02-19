import {forceCast} from './type-util';

export const SVG_NS = 'http://www.w3.org/2000/svg';

export function forceReflow(element: HTMLElement): void {
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

function getGlobalObject(): any {
	return new Function('return this')();
}

export function getWindowDocument(): Document {
	const globalObj: Window = forceCast(getGlobalObject());
	return globalObj.document;
}

function isBrowser(): boolean {
	return 'document' in getGlobalObject();
}

export function getCanvasContext(
	canvasElement: HTMLCanvasElement,
): CanvasRenderingContext2D | null {
	// HTMLCanvasElement.prototype.getContext is not defined on testing environment
	return isBrowser() ? canvasElement.getContext('2d') : null;
}

type IconId = 'p2dpad';

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

export function insertElementAt(
	parentElement: Element,
	element: Element,
	index: number,
): void {
	parentElement.insertBefore(element, parentElement.children[index]);
}

export function removeElement(element: Element): void {
	if (element.parentElement) {
		element.parentElement.removeChild(element);
	}
}

export function indexOfChildElement(element: Element): number {
	const parentElem = element.parentElement;
	if (!parentElem) {
		return -1;
	}

	const children: Element[] = Array.prototype.slice.call(parentElem.children);
	return children.indexOf(element);
}

export function findNextTarget(ev: FocusEvent): HTMLElement | null {
	if (ev.relatedTarget) {
		return forceCast(ev.relatedTarget);
	}
	// Workaround for Firefox
	if ('explicitOriginalTarget' in ev) {
		return (ev as any).explicitOriginalTarget;
	}
	// TODO: Workaround for Safari
	// Safari doesn't set next target for some elements
	// (e.g. button, input[type=checkbox], etc.)

	return null;
}
